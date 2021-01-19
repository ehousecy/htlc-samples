import {
    addWallet,
    feeTransfer,
    newHTLC,
    withdraw,
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


let hashLock = '0x904f7117d030132da8188f096267ba3278be54e982bf5510c8a493a64003d3bb'
let expireTimestamp = Date.now() + 20000000000
let preimage = "0x3131310000000000000000000000000000000000000000000000000000000000"

function addTestWallet() {
    addWallet(privateKey1,address1)
    addWallet(privateKey2,address2)
}

async function transferFee2Address2() {
    let res = await feeTransfer()
    console.log(res)
}

async function deploy() {
    let res = await deployHTLC()
    console.log(res)
}

var htlcId:any
async function lockEth() {
    let res = await newHTLC(address2, hashLock, expireTimestamp, '300000', address1)
    console.log("------lock asset result------")
    console.log(res)
    let blockNum = res.blockNumber
    console.log(blockNum)
    await newHTLCEvent(blockNum, blockNum)
}

async function getTx() {
    // let res = await getTransactionFromBlock('0x66482e123d2f853b8f48f8cb893382d597e8f93e1e38e4270d7aa8f838f1d469', 3321)
    // console.log(res)
    let res2 = await getTransaction('0x4d2da9ad0e86648ff4d34eb7058ef77b3e4cf6eaa0e9765eb827a2f3ad9325c6')
    console.log(res2)
}

async function newHTLCEvent(fromBlock:string|number, toBlock:string|number) {
    let res = await queryNewHTLCEvent(fromBlock, toBlock)
    htlcId = res[0].returnValues.htlcId
    console.log("htlcId is:"+htlcId)
}


async function getTestContract() {
    let res = await getContract(htlcId, address1)
    console.log(res)
}


async function withdrawEth() {
    addWallet(privateKey2,address2)
    let res = await withdraw(htlcId, preimage, address2)
    console.log("------withdraw result------")
    console.log(res)
}


async function workFlow() {
    console.log("----- transferFee -----")
    await transferFee2Address2()
    console.log("----- deploy -----")
    await deploy()
    console.log("----- lockEth -----")
    await lockEth()
    console.log("----- withdrawEth -----")
    await withdrawEth()
    console.log("----- getTestContract -----")
    await getTestContract()
}

// feeTransfer()
workFlow()
// getTx()
// console.log(Date.now())