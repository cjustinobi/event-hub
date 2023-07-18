import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
import { authorizationFunction } from '../utils'
import GetEventsByAccount from '../flow/cadence/scripts/GetEventsByAccount.cdc'
import CreateNewEvent from '../flow/cadence/transactions/CreateNewEvent.cdc'
import EventCard from '../components/EventCard'

// import uspImg from '../../assets/img/usp-img.png'
// import useCurrentUser from '../hooks/useCurrentUser'

// const user = useCurrentUser()

export default function Home() {

  const isSealed = statusCode => statusCode === 4 // 4: 'SEALED'

  const [user, setUser] = useState({loggedIn: null})
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


  useEffect(() => fcl.currentUser.subscribe(setUser), [])



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

      <div className="">
        <h2 className="text-accent text-[15rem] leading-tight font-bold text-center">Event <br /> Hub</h2>
      </div>
      <div className="text-center mt-[6rem] mb-[4rem]">
        <h2 className="text-3xl font-bold">Get rewarded for attending events</h2>
        <p>Get refunded for attending while you share from a pool of event absentees. It is that simple!</p>
      </div>

    <div className="flex ml-[6rem] mr-[6rem]">
        { eventList.length > 0 ?
            eventList.map((event) => {
              return (<EventCard key={event.id} event={event} />)
            }) : 'Your Events will show up here!'
          }  
        
      </div>
  </div>
  )

}