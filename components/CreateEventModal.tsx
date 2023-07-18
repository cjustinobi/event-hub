import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import CreateNewEvent from '../flow/cadence/transactions/CreateNewEvent.cdc'
import { toTimestamp } from '../utils';

interface CreateEventModalProps {
  modal: boolean;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({modal, hideModal}) => {

const isSealed = statusCode => statusCode === 4 

const [limit, setLimit] = useState('')
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState<number | undefined>()
  const [description, setDescription] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [lastTransactionId, setLastTransactionId] = useState()
  const [transactionStatus, setTransactionStatus] = useState()



  const createEvent = async (event) => {
    event.preventDefault()

    if (!title.length) {
      throw new Error('Please add a new greeting string.')
    }

    const transactionId = await fcl.mutate({
      cadence: CreateNewEvent,
      args: (arg, t) => [
        arg(title, t.String),
        arg(limit, t.UInt64),
        arg(startTime, t.UInt128),
        arg(description, t.String),
        arg(imagePath, t.String)
        ]
    })

    setLastTransactionId(transactionId)
    // hideModal()
  }

  useEffect(() => {
    if (lastTransactionId) {
    console.log('Last Transaction ID: ', lastTransactionId)

    fcl.tx(lastTransactionId).subscribe(res => {
      setTransactionStatus(res.statusString)

      // Query for new chain string again if status is sealed
      // if (isSealed(res.status)) {
      //   getEvents()
      // }
    })
    }
  }, [lastTransactionId])

  return (

<div className={`${modal ? '' : 'hidden'} bg-black p-6 rounded-md shadow-lg z-10 absolute inset-0 flex items-center justify-center`}>

    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
    

      <div className="relative top-[2%] md:top-[3%] md:max-w-[610px]  bg-black  rounded-[20px]  max-w-[750px] flex justify-center w-[100%] botton-[0%] m- p-[3%] align-center ">
          <div className="justify-center flex w-[100%] h-[100%] bg-[black] items-center ">
            <div className="main-container grid w-[100%] top-[20%]  max-w-[700px]">
              <h1 className="text-[#fff] justify-center font-clashDisplay text-[30px] font-bold bottom-[70%] relative flex">
                Create Event
              </h1>
              <span>{transactionStatus}</span>

              <div className="grid grid-cols-2 gap-[20px]">
                <div className=" item-center justify-between">
                <span className="text-[#fff] font-circularStd md:text-[15px] text-[14px] lg:text-[19px]">
                  Event Name
                </span>

                  <input
                    onChange={e => setTitle(e.target.value)}
                    className="shadow appearance-none border bg-transparent rounded-[7px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="inputField"
                    placeholder="Event Name"
                  />
                </div>
                <div className=" item-center justify-between">
                <span className="text-[#fff] font-circularStd md:text-[15px] text-[14px] lg:text-[19px]">
                  Max Capacity
                </span>

                  <input
                    onChange={e => setLimit(e.target.value)}
                    className="shadow appearance-none border bg-transparent rounded-[7px] w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                    id="inputField"
                    type="number"
                    placeholder="Max Capacity"
                  />
                </div>
                <div className=" item-center justify-between">
                <span className="text-[#fff] font-circularStd md:text-[15px] text-[14px] lg:text-[19px]">
                  Start Time
                </span>
                  <input
                    onChange={e => setStartTime(toTimestamp(e.target.value))}
                    type="datetime-local"
                    className="shadow appearance-none border bg-transparent rounded-[7px] w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Start time"
                  />
                </div>
                <div className=" item-center justify-between">
                <span className="text-[#fff] font-circularStd md:text-[15px] text-[14px] lg:text-[19px]">
                  Image Path
                </span>
                  <input
                    onChange={e => setImagePath(e.target.value)}
                    className="shadow appearance-none border bg-transparent rounded-[7px] w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Image Path"
                  />
                </div>
              </div>

              <div className="center">
                <div className="top-[17px] relative grid">
                <span className="text-[#fff]  font-circularStd md:text-[15px] text-[14px] lg:text-[19px]">
                  Description
                </span>
                  <textarea
                    onChange={e => setDescription(e.target.value)}
                    className="shadow appearance-none border  bg-transparent rounded-[7px] h-[100%] w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Description..."
                    rows={4}
                  />
                </div>

                <div className="section flex top-[40px] relative justify-between">
                  <button onClick={() => hideModal()} className="w-[35%] border-2 h-[47px] border-none gap-[20px] p-[7px 25px] bg-gradient-to-tr from-yellow-500 to-red-500 rounded-[8px]  relative justify-center rounded-[8px] text-center items-center  text-[#fff] flex">
                    Cancel
                  </button>
                 <button onClick={createEvent} className="w-[35%] border-2 h-[47px] border-none gap-[20px] p-[7px 25px] bg-gradient-to-tr from-yellow-500 to-red-500 rounded-[8px]  relative justify-center rounded-[8px] text-center items-center  text-[#fff] flex">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

  </div>
  )
}

export default CreateEventModal