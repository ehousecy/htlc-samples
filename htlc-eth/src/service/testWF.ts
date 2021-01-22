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
let expireDuration:number = 17000000000
let expireTimestamp = Date.now() + expireDuration
let preimageBytesHex = "0x726f6f74726f6f74"
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

async function buyMeACoffee() { 
  console.log(await faucet("asender", "1000"))
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
  let res = await createHTLC("asender", "areceiver", "1000", (expireDuration * 1.5 ).toString(), hashLock, "passwd1", midAccount)
  console.log("------Lock Fabric Assets Result------")
  console.log(res)
  fabricHTLCId = JSON.parse(JSON.stringify(res.data))
  console.log("fabricHTLC Id: ", fabricHTLCId)
  console.log("")
  console.log("")
  console.log("")
}


async function withdrawFabricAsset() {
  console.log("", fabricHTLCId)
  let res = await withdrawFabricAssets(fabricHTLCId, preimage)
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
  console.log("------Deploy Eth Htlc Result------")
  console.log(res)
  console.log("")
  console.log("")
  console.log("")
}

var htlcId:any
async function lockEth() {
    let res = await newHTLC(address2, "0x0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", expireTimestamp, '1100000000000000000', address1)
    console.log("------Lock Eth Asset Result------")
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
    console.log("")
    console.log("")
    console.log("")
}


async function withdrawEth() {
    addWallet(privateKey2,address2)
    let res = await withdrawEthAssets(htlcId, preimageBytesHex, address2)
    console.log("------Withdraw Eth Result------")
    console.log(res)
    console.log("")
    console.log("")
    console.log("")
}


async function testWf() {
  await createFabricMidAccount()
  await lockFabricAssets()
  addTestWallet()
  await deploy()
  await lockEth()
  await withdrawEth()
  await withdrawFabricAsset()
}

// testWf()
transferFee2Address2()
