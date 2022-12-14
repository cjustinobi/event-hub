import { useState, useEffect } from 'react'

export default function () {

  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  async function checkIsConnected() {
    const accounts = await window.ethereum.request({method: 'eth_accounts'})
    setAddress(accounts[0])
    setIsConnected(!!accounts.length)
    return !!accounts.length
  }


  useEffect(() => {
    checkIsConnected()
  })

  return [isConnected, address]

}