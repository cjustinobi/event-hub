import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import styles from './Event.module.css'
import useIsConnected from '../../hooks/useIsConnected'
import { connectWallet, eventHubContract, createNewEvent } from '../../utils/interact'
import { addToIPFS } from '../../utils/ipfs'

function Event() {

  const [isConnected, address] = useIsConnected()
  const [contract, setContract] = useState()
  const [status, setStatus] = useState('')
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [refund, setRefund] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventFile, setEventFile] = useState('');
  const [eventID, setEventID] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault()

    if (isConnected) {
      const CID = await saveToIPFS()

      let deposit = ethers.utils.parseEther(refund);
      // let deposit = refund
      let eventDateAndTime = new Date(`${eventDate} ${eventTime}`);
      let eventTimestamp = eventDateAndTime.getTime();

      const { status } = await createNewEvent(address, {
        eventTimestamp,
        deposit,
        maxCapacity,
        CID,
        ID: CID
      })
      setStatus(status)
    }

  }

  const saveToIPFS = async () => {
    const eventDateAndTime = new Date(`${eventDate} ${eventTime}`)
    return await addToIPFS(
      eventName,
      ethers.utils.parseEther(refund),
      eventDateAndTime,
      eventDateAndTime.getTime(),
      maxCapacity,
      eventLink,
      eventFile,
      '123'
    )
  }

  async function addSmartContractListener() {

    eventHubContract.events.NewEventCreated({}, (error, data) => {
      if (error) {
        console.log("😥 " + error.message);
      } else {
        console.log(data.returnValues);
        console.log("🎉 Your message has been updated!");
      }
    })
  }

  useEffect(() => {
    setContract(connectWallet())
    addSmartContractListener()
  }, [])

  return (
    <div className={styles.container}>
      <h4>{status}</h4>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="eventname"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Event name
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="event-name"
                name="event-name"
                type="text"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Date & time
              <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                Your event date and time
              </p>
            </label>
            <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
              <div className="w-1/2">
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <input
                  id="time"
                  name="time"
                  type="time"
                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="max-capacity"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Max capacity
              <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                Limit the number of spots available for your event.
              </p>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="number"
                name="max-capacity"
                id="max-capacity"
                min="1"
                placeholder="100"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
            </div>
          </div>

          <input type="file" placeholder="file" onChange={ e => setEventFile(e.target.files[0]) }/>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="refundable-deposit"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Refundable deposit
              <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                Require a refundable deposit (in MATIC) to reserve one spot
                at your event
              </p>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="number"
                name="refundable-deposit"
                id="refundable-deposit"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                value={refund}
                onChange={(e) => setRefund(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="event-link"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Event link
              <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                The link for your virtual event
              </p>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="event-link"
                name="event-link"
                type="text"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                required
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
            >
              Event description
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                Let people know what your event is about!
              </p>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={10}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md dark:bg-slate-400 dark:border-slate-600 dark:text-gray-800 dark:focus:ring-gray-400 dark:focus:ring-offset-0"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
            </div>
          </div>
        </div>
        <div className="pt-5 dark:divide-slate-700">
          <div className="flex justify-end">
            <Link to="/">Cancel</Link>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Event