import {
    addWallet,
    feeTransfer,
    newHTLC,
    withdrawEthAssets,
    getTransaction,
    getTransactionFromBlock,
    queryNewHTLCEvent,
    getContract,
    deployHTLC
} from '../utils/utils'

import {
    privateKey1,
    address1,
    privateKey2,
    address2
} from '../utils/accountList'

import {
  createAccount,
  queryAccount,
  createMidAccount,
  createHTLC,
  withdrawFabricAssets,
  refund,
  QueryHTLC,
  faucet
} from '../utils/Ifabric'

let hashLock = '0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18'
let expireTimestamp = Date.now() + 20000000000
let preimageBytesHex = "0x726f6f74726f6f74000000000000000000000000000000000000000000000000"
let preimage = "rootroot"

async function QueryFabricAccount(address:string) { 
  let account = await queryAccount(address)
  let add = JSON.parse(JSON.stringify(account.data)).address
  // account = JSON.parse(JSON.stringify(account))
  if (add == '') {
    console.log("账户不存在")
  }
  console.log(add)
  return add == address
}

let midAccount = ""
async function createFabricMidAccount() { 
  let res = await createMidAccount("asender", hashLock, "hash")
  midAccount = JSON.parse(JSON.stringify(res.data)).address
  if (midAccount == '') {
    console.log("中间账户创建失败")
    process.exit(1)
  }
  console.log("------Create Mid Account Result------")
  console.log("midAccount: ", midAccount)
  console.log("")
  console.log("")
  console.log("")
  return midAccount
}

let fabricHTLCId = ""
async function lockFabricAssets() {
  let res = await createHTLC("asender", "areceiver", "0", "2000", hashLock, "passwd1", "asender0")
  console.log(res)
  fabricHTLCId = JSON.parse(JSON.stringify(res.data))
  console.log("------Lock Fabric Assets Result------")
  console.log("fabricHTLC Id: ", fabricHTLCId)
  console.log("")
  console.log("")
  console.log("")
}


async function withdrawFabricAsset() {
  let res = await withdrawFabricAssets("de1c8e736ec6025fcbd73e59027dfb9c9b649de9233efb0257ca38a90e92d45c", preimage)
  console.log("------WithDraw Fabric Assets Result------")
  console.log(res)
  console.log("")
  console.log("")
  console.log("")
}

function addTestWallet() {
    addWallet(privateKey1,address1)
    addWallet(privateKey2,address2)
}

async function transferFee2Address2() {
    let res = await feeTransfer()
    console.log(res)
    console.log("")
    console.log("")
    console.log("")
}

async function deploy() {
  let res = await deployHTLC()
  console.log("------deploy eth htlc result------")
  console.log(res)
  console.log("")
  console.log("")
  console.log("")
}

var htlcId:any
async function lockEth() {
    let res = await newHTLC(address2, "0x" + hashLock, expireTimestamp, '300000', address1)
    console.log("------lock eth asset result------")
    console.log(res)
    let blockNum = res.blockNumber
    console.log(blockNum)
    await newHTLCEvent(blockNum, blockNum)
    console.log("")
    console.log("")
    console.log("")

}


async function newHTLCEvent(fromBlock:string|number, toBlock:string|number) {
    let res = await queryNewHTLCEvent(fromBlock, toBlock)
    htlcId = res[0].returnValues.htlcId
    console.log("htlcId is:" + htlcId)
}


async function withdrawEth() {
    addWallet(privateKey2,address2)
    let res = await withdrawEthAssets(htlcId, preimageBytesHex, address2)
    console.log("------withdraw Eth result------")
    console.log(res)
    
}




async function testWf() { 
  await createFabricMidAccount()
  await lockFabricAssets()
  await deploy()
  await lockEth()
  await withdrawEth()
  await withdrawFabricAsset()
}

testWf()