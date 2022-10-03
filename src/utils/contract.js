import { ethers } from 'ethers'
import abiJSON from '../artifacts/contracts/EventHub.sol/EventHub.json'
const contractAddress = '0xDF7631473550ACd833695a4b3fa1D0aCBdCC8Eae'

function contract() {
  const contractABI = abiJSON.abi
  let eventHubContract
  try {
    const { ethereum } = window

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      eventHubContract = new ethers.Contract(contractAddress, contractABI, signer) // instantiating new connection to the contract
    } else {
      console.log('Ethereum object doesn\'t exist!')
    }
  } catch (error) {
    console.log('ERROR:', error)
  }
  return eventHubContract
}

export default contract