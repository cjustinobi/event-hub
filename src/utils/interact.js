

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { newKit } from "@celo/contractkit";
import dotenv from "dotenv";
import EventHub from '../artifacts/EventHub.json'

// LOAD ENV VAR
dotenv.config();

export const kit = newKit(process.env.REACT_APP_DATAHUB_NODE_URL);
const contractAddress = '0x58A09B060Dd62A7e82DBFC37Be62cA4E8adE271C'
const connectAccount = kit.addAccount(process.env.REACT_APP_PRIVATE_KEY);
// CONTRACT INSTANCE
export const eventHubContract = new kit.web3.eth.Contract(
  EventHub.abi,
  contractAddress
)

// export const getWeb3 = async () => {
//   let web3 = window.web3;
//   if (typeof web3 !== "undefined") {
//     return new Web3(web3.currentProvider);
//
//   } else {
//     return false;
//   }
// }

// export const getAccount = async (web3) => {
//   return await web3.eth.getAccounts();
// }

export const connectWallet = async function () {
  if (window.celo) {
    try {
      console.log("⚠️ Please approve this DApp to use it.")
      await window.celo.enable()
      // notificationOff()
      // const web3 = new Web3(window.celo)
      // kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]
      return kit.defaultAccount

      // contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
    } catch (error) {
      console.log(`⚠️ ${error}.`)
      // notification(`⚠️ ${error}.`)
    }
  } else {
    console.log("⚠️ Please install the CeloExtensionWallet.")
  }
}

export const connectWalletxx = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      return addressArray[0]

    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const createNewEvent = async (address, { eventTimestamp, deposit, maxCapacity, CID, ID }) => {

  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  // if (message.trim() === "") {
  //   return {
  //     status: "❌ Your message cannot be an empty string.",
  //   };
  // }


  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: eventHubContract.methods.createNewEvent(eventTimestamp, deposit, maxCapacity, CID, ID).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};