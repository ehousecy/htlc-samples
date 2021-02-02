const fs = require('fs')

import {
    hex2Utf8,
    addWallet,
    makeContract,
    newHTLC,
    withdrawEthAssets,
    getContract,
} from '../../../htlc-eth/src/utils/utils'

import {
    BobPrivateKey,
    BobAddress,
    AlicePrivateKey,
    AliceAddress
} from '../../../htlc-eth/src/utils/accountList'

import {
  createMidAccount,
  createHTLC,
  withdrawFabricAssets,
  refund,
  QueryHTLC,
} from '../utils/Ifabric'
import { AliceAccount, AlicePasswd, BobAccount } from '../utils/accounts'

let hashLock = '0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18'
let expireDuration:number = 20000000000
let expireTimestamp = Date.now() + expireDuration
let preimageBytesHex = "0x726f6f74726f6f74"


let midAccount = ""
async function createFabricMidAccount() {
  console.log("------Create Mid Account------")
  console.log("INPUT:")
  console.log("sender: ", AliceAccount)
  console.log("receiver: ", BobAccount)
  console.log("preimage: ", hashLock+"\n") 
  let res = await createMidAccount(AliceAccount, BobAccount, hashLock, "hash")
  console.log("OUTPUT:")
  midAccount = JSON.parse(JSON.stringify(res.data)).address
  if (midAccount == '') {
    console.log("Create Mid Accountc Failed")
    console.log("Process Exit!")
    process.exit(1)
  }
  console.log("Successfully Created MidAccount: ", midAccount)
  console.log("\n\n\n")
  return midAccount
}

let fabricHTLCId = ""
async function lockFabricAssets() {
  console.log("------Lock Fabric Assets------")
  console.log("INPUT:")
  console.log("Alice's Account: ", AliceAccount)
  console.log("Bob's Account: ", BobAccount)
  console.log("Amount Fabric Assets to be Locked: ", 10)
  console.log("Expiration Duration: ", (expireDuration * 1.5).toString())
  console.log("HashLock: ", hashLock)
  console.log("AlicePasswd: ", AlicePasswd)
  console.log("MidAccount: ", midAccount+"\n")
  let res = await createHTLC(AliceAccount, BobAccount, "10", (expireDuration * 1.5 ).toString(), hashLock, AlicePasswd, midAccount)
  console.log("OUTPUT:")
  if (res.err != '')
  {
    console.log("Lock Fabric Assets Failed: ", res.err)
    console.log("Process Exit!")
    console.log("Process Exit!")
    process.exit(1)
  }
  fabricHTLCId = JSON.parse(JSON.stringify(res.data))
  console.log("Successfully Locked Fabric Assets, HTLC ID: ", fabricHTLCId)
  console.log("\n\n\n")
}


function addTestWallet() {
    addWallet(BobPrivateKey, BobAddress)
    addWallet(AlicePrivateKey, AliceAddress)
}


var htlcId:any
async function lockEth() {
    console.log("------Bob Lock Eth Asset------")
    console.log("INPUT: ")
    console.log("hashlock: ", "0x"+hashLock)
    console.log("expiration timestamp: ", expireTimestamp)
    console.log("Amount of wei(1ETH = 10^18wei) to be locked: ", '1100000000000000000')
    console.log("Bob's Address: ", BobAddress+"\n")
    let res = await newHTLC(AliceAddress, "0x"+hashLock, expireTimestamp, '1100000000000000000', BobAddress)
    console.log("OUTPUT:")
    let blockNum = res.blockNumber
    if (blockNum == undefined || '') {
      console.log("Lock Eth Failed")
      console.log("Process Exit!")
      process.exit(1)
    }
    console.log("Eth Has Been Locked. Generated HTLC ID Is: ", res.events.LogHTLCNew.returnValues.htlcId)
    htlcId = res.events.LogHTLCNew.returnValues.htlcId
    console.log("\n\n\n")
}


// async function newHTLCEvent(fromBlock:string|number, toBlock:string|number) {
//   let res = await queryNewHTLCEvent(fromBlock, toBlock)
//   console.log(res)
//     htlcId = res[0].returnValues.htlcId
//     console.log("htlcId is:" + htlcId)
//     console.log("")
//     console.log("")
//     console.log("")
// }

let preimage = ''
async function withdrawEth() {
    addWallet(AlicePrivateKey, AliceAddress)
    console.log("------Alice Withdraw Eth------")
    console.log("INPUT:")
    console.log("ETH HTLC ID: ", htlcId)
    console.log("PreImage Bytes: ", preimageBytesHex)
    console.log("Alice's Address and Private Key\n")
    let res = await withdrawEthAssets(htlcId, preimageBytesHex, AliceAddress)
    console.log("OUTPUT:")
    if (!res.events.LogHTLCWithdraw.returnValues.htlcId == null) { 
      console.log("Withdraw Eth Failed")
      console.log("Process Exit!")
      process.exit(1)
    }
    res = await getContract(htlcId, BobAddress)
    if (res.withdrawn == true) {
      console.log("Successfully Withdrew Eth, Preimage Hex Is: ", res.preimage)
      console.log("Convert Preimage Hex To String: ", hex2Utf8(res.preimage))
      preimage = hex2Utf8(res.preimage)
    } else { 
      console.log("Haven't Withdrawn Eth Yet")
    }
    console.log("\n\n\n")
}


async function withdrawFabricAsset() {
  console.log("------Withdraw Fabric Assets------")
  console.log("INPUT:")
  console.log("Fabric HTLC ID: ", fabricHTLCId)
  console.log("preimage: ", preimage +"\n")
  let res = await withdrawFabricAssets(fabricHTLCId, preimage)
  console.log("OUTPUT:", res.data)
  console.log("\n\n\n")
}

async function readContractAdd() {
  let contractAddress = fs.readFile(__dirname + "/contractAddress.txt", (error: any, data: any) => {
    if (error)
      throw new Error(error);
    else
      console.log(data.toString())
    contractAddress = data.toString()
  })
  console.log("contractAdd: ", contractAddress)
  return contractAddress
}

async function testWf() {
  await createFabricMidAccount()
  await lockFabricAssets()
  addTestWallet()

  const readFile = require("util").promisify(fs.readFile);
  let contractAddress = await readFile(__dirname+"/contractAddress.txt", "utf-8")
  console.log(contractAddress)
  makeContract(contractAddress)

  await lockEth()
  await withdrawEth()
  await withdrawFabricAsset()
}

testWf()
