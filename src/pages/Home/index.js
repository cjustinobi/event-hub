
import { useState, useEffect } from 'react'

import { kit, eventHubContract } from '../../utils/interact'
import { eventList } from '../../utils/ipfs'
// import useIsConnected from '../../hooks/useIsConnected'

import styles from './Home.module.css'




function Home() {

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs'

  // const [isConnected, address] = useIsConnected()
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('No connection to the network.')
  const [balances, setBalances] = useState({ CELO: 0, cUSD: 0, Vault: 0 });

  const getBalanceHandle = async () => {
    const goldtoken = await kit._web3Contracts.getGoldToken();

    const totalBalance = await kit.getTotalBalance(
      process.env.REACT_APP_ADDRESS
    );

    const { CELO, cUSD } = totalBalance;
    setBalances({
      CELO: kit.web3.utils.fromWei(CELO.toString()),
      cUSD: kit.web3.utils.fromWei(cUSD.toString())
    });
  };



  const rsvp = async (eventId, deposit) => {
    // const result = await getAccount(getWeb3())
    // return console.log(result)
    // if (isConnected) {

      const res = await eventHubContract.methods.createNewRSVP(eventId).send({
        from: process.env.REACT_APP_ADDRESS,
        value: deposit
        // value: ethers.utils.parseEther(deposit)
      })
      console.log(res)

      eventHubContract.events.NewRSVP()
        .on("connected", function(subscriptionId){ console.log(subscriptionId);})
        .on('data', function(event){ console.log(event);})
    // }

  }

  const confirm = async (eventId) => {

    const txHash = await eventHubContract.methods.getConfirmedRSVPs(eventId).call()
    console.log(txHash)

  }


  useEffect(async () => {
    setEvents(await eventList())
    getBalanceHandle()
  }, [])


  return (
    <div className={styles.container}>
      {events.length && events.map(event => (
        <div>
          <img width="200px" src={`${ipfsGateway}/${event.ipfs_pin_hash}`} alt=""/>
          <div>EVent Id: { event.metadata.keyvalues.name }</div>
          {/*<div>Time: { Date(event.metadata.keyvalues.dateAndTime) }</div>*/}
          <div>Time: { event.metadata.keyvalues.dateAndTime }</div>
          {/*<div>CID: { event.eventDataCID }</div>*/}
          <div>Maximum capacity: { event.maxCapacity }</div>
          <div>Deposit: { kit.web3.utils.fromWei(event.metadata.keyvalues.deposit, 'ether') }</div>
          <button onClick={() => rsvp(event.ipfs_pin_hash, event.metadata.keyvalues.deposit)}>RSVP</button>
          <button onClick={() => confirm(event.ipfs_pin_hash)}>Get confirmed RSVP</button>
        </div>
      ))}
      Balances {balances.CELO}
    </div>
  )
}

export default Home