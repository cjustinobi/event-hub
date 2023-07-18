import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import Image from 'next/image'
import Link from 'next/link'
import CreateEventModal from '../../components/CreateEventModal'

const Header = () => {

	const [user, setUser] = useState({loggedIn: null})
  const [showDropdown, setShowDropdown] = useState(false)

	const [modal, setModal] = useState(false)
	const hideModal = () => setModal(false)

	  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const logoutHandler = () => {
    fcl.unauthenticate
    setShowDropdown(false);
  };




	useEffect(() => fcl.currentUser.subscribe(setUser), [])

	return (
		<header>
		<CreateEventModal modal={modal} hideModal={hideModal}/>
        <div className="bg-black-1 py-5 2xl:py-10 px-8 2xl:px-24">
          <div className="bg-pink-400- py-1 w-full h-full flex items-center justify-between">
            <Link href="/" className="text-2xl font-ClashDisplay font-bold text-white">Event Hub</Link>

            <div className="flex md:space-x-24 xl:space-x-32 2xl:space-x-44 items-center justify-start">
              <div className="flex space-x-8 xl:space-x-16 items-start justify-start">
                <Link href="/events" className="text-base text-gray-400">Events</Link>
                <Link href="/rsvps" className="text-base text-gray-400">RSVPs</Link>
              </div>
              
            </div>
			        <div className="flex space-x-8- xl:space-x-16- items-center justify-start">
                <div onClick={() => setModal(true)} className="flex space-x-2 items-center justify-center text-base text-white cursor-pointer border rounded-3xl md:px-8 2xl:px-16 py-6">
                  Register
                </div>
                <div className="relative">
                <div onMouseEnter={handleMouseEnter} className='cursor-pointer inline-flex ml-8 xl:ml-16 items-center justify-center md:px-8 2xl:px-16 py-6 border rounded-3xl'>
                  <span onClick={fcl.logIn} className='text-base text-white'>{user.loggedIn ? user.addr : "Log In"}</span>
                </div>
                {user.loggedIn && showDropdown && (
                  <div className="absolute top-full left-20 mt-2 p-4 shadow border rounded-3xl">
                    {/* Dropdown content */}
                    <ul>
                      <li>
                        <button onClick={logoutHandler}>Log Out</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
	)
}

export default Header