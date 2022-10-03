
import { ethers } from 'ethers'

  function connect() {
    //client side code
    if(!window.ethereum) return console.log('Metamask not installed')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    return window.ethereum.enable().then(()=>{
      const signer = provider.getSigner()
      return signer.getAddress().then((res)=>{
        return res
      })
    })
  }

  export default connect

