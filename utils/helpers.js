import fcl from "@onflow/fcl"
import { SHA3 } from "sha3"

import { ec as EC} from 'elliptic'
const ec = new EC('p256');

export const ADDRESS = "0xf8d6e0586b0a20c7";
const PRIVATE_KEY = "ce227b6554b5e0798d03a894a675be90c2a4242035b4c843ea9316d9ed7af9ca ";
const KEY_ID = 0;

const sign = (message) => {
  const key = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, "hex"));
  const sig = key.sign(hash(message)); // hashMsgHex -> hash
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

const hash = (message) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}

export const authorizationFunction = async (account) => {
  // authorization function need to return an account
  return {
    ...account, // bunch of defaults in here, we want to overload some of them though
    tempId: `${ADDRESS}-${KEY_ID}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
    addr: 'f8d6e0586b0a20c7', // the address of the signatory, currently it needs to be without a prefix right now
    keyId: Number(KEY_ID), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
    signingFunction: async signable => {
      // Singing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      return {
        addr: ADDRESS, // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
        keyId: Number(KEY_ID), // needs to be the same as account.keyId, once again make sure its a number and not a string
        signature: sign(signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      }
    }
  }
}

export const truncate = input => `${input.substring(0, 5)}...${input.slice(-4)}`

export const toTimestamp = time => time ? (new Date(time)).getTime() / 1000 : undefined