import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { eventHubContract } from '../../utils/interact'
import { eventList } from '../../utils/ipfs'
import useIsConnected from '../../hooks/useIsConnected'

import styles from './Home.module.css'

function Home() {

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs'

  const [isConnected, address] = useIsConnected()
  const [contract, setContract] = useState()
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('No connection to the network.')

  function addSmartContractListener() {
    eventHubContract.events.NewRSVP({}, (error, data) => {
      if (error) {
        console.log("😥 " + error.message);
      } else {
        console.log(data.returnValues[1]);
        console.log("");
        console.log("🎉 Your message has been updated!");
      }
    });
  }

  const rsvp = async (eventId, deposit) => {
    if (isConnected) {

      const res = await eventHubContract.methods.createNewRSVP(eventId).send({
        from: address,
        value: deposit
        // value: ethers.utils.parseEther(deposit)
      })
      console.log(res)

      eventHubContract.events.NewRSVP()
        .on("connected", function(subscriptionId){ console.log(subscriptionId);})
        .on('data', function(event){ console.log(event);})
      }

  }

  const confirm = async (eventId) => {

    // const transactionParameters = {
    //   to: '0x4dE0EF55De2EA0C78d9BB12B6a57efD083b219a1', // Required except during contract publications.
    //   from: address, // must match user's active address.
    //   data: eventHubContract.methods.getConfirmedRSVPs(eventId).encodeABI(),
    // };
    //
    // //sign the transaction
    //
    //   const txHash = await window.ethereum.request({
    //     method: "eth_sendTransaction",
    //     params: [transactionParameters],
    //   });

      const txHash = await eventHubContract.methods.getConfirmedRSVPs(eventId).call()
      console.log(txHash)

  }

  const getEvents = async () => {

    const res = await contract.getEventLength()
    console.log('events ', res.toNumber())
    if (res.toNumber()) {
      let events = []
      let i = 0

      while (i < res.toNumber()) {
        const eventId = await contract.getEventId(i)
        if (eventId) {
          const event = await contract.getEvent(eventId)
          events.push(event)
        }
        i++
        // await contract.idToEvent()
      }
      setEvents(events)
    }
  }

  useEffect(async () => {
    // setContract(getContract())
    setEvents(await eventList())
    addSmartContractListener()
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
          {/*<div>Maximum capacity: { event.maxCapacity.toNumber() }</div>*/}
          <div>Deposit: { ethers.utils.formatUnits(event.metadata.keyvalues.deposit, 'ether') }</div>
          <button onClick={() => rsvp(event.ipfs_pin_hash, event.metadata.keyvalues.deposit)}>RSVP</button>
          <button onClick={() => confirm(event.ipfs_pin_hash)}>Get confirmed RSVP</button>
        </div>
      ))}
    </div>
  )
}

export default Home