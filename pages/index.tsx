import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from '@onflow/types'
import { authorizationFunction } from '../utils'
import GetEventsByAccount from '../flow/cadence/scripts/GetEventsByAccount.cdc'
import CreateNewEvent from '../flow/cadence/transactions/CreateNewEvent.cdc'
// import useCurrentUser from '../hooks/useCurrentUser'

// const user = useCurrentUser()

export default function Home() {

  const isSealed = statusCode => statusCode === 4 // 4: 'SEALED'

  const [user, setUser] = useState({loggedIn: null})
  const [limit, setLimit] = useState('')
  const [title, setTitle] = useState('')
  const [eventList, setEventList] = useState([])
  const [lastTransactionId, setLastTransactionId] = useState()
  const [transactionStatus, setTransactionStatus] = useState(null) // NEW

  const getEvents = async (account) => {
    account = user?.addr;

    let res;

    try {
      res = await fcl.query({
        cadence: GetEventsByAccount,
        args: (arg, t) => [arg(account, t.Address)]
      })
    } catch(e) {
      res = []
    }

    console.log(res)

    setEventList(res.sort((a, b) => b.id - a.id))
  }

  const createEvent = async (event) => {
    event.preventDefault()

    if (!title.length) {
      throw new Error('Please add a new greeting string.')
    }

    const transactionId = await fcl.mutate({
      cadence: CreateNewEvent,
      args: (arg, t) => [arg(title, t.String), arg(limit, t.UInt64)]
    })

    setLastTransactionId(transactionId)
  }
  
  useEffect(() => fcl.currentUser.subscribe(setUser), [])



  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import HelloWorld from 0xf8d6e0586b0a20c7

        transaction {
          prepare(acct: AuthAccount) {
            // Here we create a resource and move it to the variable newHello,
            // then we save it in the account storage
            let newHello <- HelloWorld.createHelloAsset()
    
            acct.save(<-newHello, to: /storage/HelloAssetTutorial)
          }
        }
      `,
      payer: authorizationFunction,
      proposer: authorizationFunction,
      authorizations: [authorizationFunction],
      limit: 50
    })
console.log(transactionId)
    // const transaction = await fcl.tx(transactionId).onceSealed()
    // console.log('transaction')
    // console.log(transaction)
    console.log(transactionId)
  }



  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div> {/* NEW */}
        <button onClick={initAccount}>Init Account</button>
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  useEffect(() => {
    if (lastTransactionId) {
      console.log('Last Transaction ID: ', lastTransactionId)

      fcl.tx(lastTransactionId).subscribe(res => {
        setTransactionStatus(res.statusString)
  
        // Query for new chain string again if status is sealed
        if (isSealed(res.status)) {
          getEvents()
        }
      })
    }
    const fetchEvents = async () => {
      await getEvents(user?.addr);
    };

    if (user?.addr) {
      fetchEvents();
    }
  }, [lastTransactionId, user])

  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow App</h1>
      <form onSubmit={createEvent}>
        <label htmlFor="tweet">Create a new Tweet</label>
        <textarea 
          id="eventContents"               
          placeholder="I feel..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          name="eventContents" required></textarea>
          <input type="number" placeholder="title" onChange={e => setLimit(e.target.value)} />
          <small>Share your thoughts with the world.</small>
          <input type="submit" value="Eventccc" />
        </form>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }

{
        eventList.length > 0 ?
          eventList.map((event) => {
            return (<div key={event.id}>{event.title} - {event.limit}</div>)
          }) : 'Your tweets will show up here!'
        } 
    </div>
  )
}
