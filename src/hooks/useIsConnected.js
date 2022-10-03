import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function () {

  const [isConnected, setIsConnected] = useState(false)

  async function checkIsConnected() {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});
    setIsConnected(!!accounts.length)
    return !!accounts.length
  }


  useEffect(() => {
    checkIsConnected()
  })

  return [isConnected]

}