import { useState, useEffect } from 'react'
import getContract from '../../utils/contract'
import './Payout.css';

import { ethers } from 'ethers';
import RSVP from '../../artifacts/contracts/RSVP.sol/RSVP.json';

function Payout() {

  const [contract, setContract] = useState()
  const [eventId, setEventId] = useState()

  const rsvpAddress = '0x9217Af18E87479DDd4026089B902e16b7B8FF663';

  async function payout(e) {
    e.preventDefault();
    // if (contract) {
      const payoutButton = await contract.payout('0')
      // const payoutButton = await contract.totalEvents()
  // const res = await payoutButton.wait()

      console.log(payoutButton);

  }

  useEffect(() => {
    setContract(getContract())
  }, [])

  return( 
    <div>
      <form className='payout-form' onSubmit={payout}>
        <div className='payout-form-container'>
          <label className='payout-form-label'>Enter EventId: </label>
          <input type='text' className='payout-id' onChange={ e => setEventId({ eventId: e.target.value }) }/>
          <button className='payout-button' type='submit'>Payout</button>
        </div>
      </form>
    </div>
  )
}

export default Payout;
