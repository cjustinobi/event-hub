import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import getContract from '../../utils/contract'
import { eventHubContract } from '../../utils/interact'
import { eventList } from '../../utils/ipfs'
import connect  from '../../utils/connect'
import useIsConnected from '../../hooks/useIsConnected'

import styles from './Home.module.css'


function Home() {

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs'

  const [isConnected] = useIsConnected()
  const [contract, setContract] = useState()
  const [events, setEvents] = useState([])

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
      setContract(getContract())
      if (contract) {
        const res = await contract.createNewRSVP(eventId).send({
          from: '0xfCdcB824747B3b8e4058E90a59468eD0ef538Ae9',
          value: '0.0023'
          // value: ethers.utils.formatUnits(deposit, 'ether')
        })
        console.log(res)

        contract.events.NewRSVP()
          .on("connected", function(subscriptionId){ console.log(subscriptionId);})
          .on('data', function(event){ console.log(event);})
      }
    } else {
      const address = await connect()
      setContract(getContract())
      // do rsvp
      console.log(address)
    }
  }

  const confirm = async (eventId) => {
    setContract(getContract())
    if (contract) {
      const res = await contract.getConfirmedRSVPs(eventId)
      console.log(res)
    }
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