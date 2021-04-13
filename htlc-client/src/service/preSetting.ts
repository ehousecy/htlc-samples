const fs = require('fs');
import { AliceAccount, AlicePasswd, BobAccount, BobPasswd } from '../utils/accounts'

// Alice&Bob's address&privateKey on ethereum
import { BobAddress, BobPrivateKey, AliceAddress, AlicePrivateKey} from '../../../htlc-eth/src/utils/accountList'

import { createAccount, queryAccount, faucet } from "../utils/Ifabric"
import { getBalance, feeTransfer, deployHTLC, ethFaucet } from "../../../htlc-eth/src/utils/utils"

async function createAliceBobAccounts() { 
  console.log("--------------------Create Alice Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice's Account: ", AliceAccount)
  console.log("Alice's PassWord: ", AlicePasswd, "\n")
  let res = await createAccount(AliceAccount, AlicePasswd)
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
  console.log("--------------------Create Bob Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Bob's Account: ", BobAccount)
  console.log("Bob's PassWord: ", BobPasswd)
  res = await createAccount(BobAccount, BobPasswd)
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
}

async function recharge1K2Alice() {
  console.log("--------------------Using Faucet to Recharge 88000 Assets 2 Alice on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice's Account: ", AliceAccount)
  console.log("Assets Amount: ", "88000"+"\n")
  let res = await faucet(AliceAccount, "88000")
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
}

async function queryAliceBobAccount() {
  console.log("--------------------Query Alice Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice's Account Address: ", AliceAccount+"\n")
  let alice = await queryAccount(AliceAccount)
  console.log("OUTPUT:")
  console.log("Name: ", JSON.parse(JSON.stringify(alice.data)).address)
  console.log("Amount: ", JSON.parse(JSON.stringify(alice.data)).amount, "\n\n\n")
  console.log("--------------------Query Bob Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Bob's Account Address: ", BobAccount + "\n")
  let bob = await queryAccount(BobAccount)
  console.log("OUTPUT:")
  console.log("Name: ", JSON.parse(JSON.stringify(bob.data)).address)
  console.log("Amount: ", JSON.parse(JSON.stringify(bob.data)).amount, "\n\n\n")
}

async function deploy() {
  console.log("------Bob Deploy Eth Htlc Contract------")
  console.log("INTPUT:")
  console.log("1. Bob's private key; 2. HTLC contract Abi; 3. HTLC contract Bytes Code\n")
  let res = await deployHTLC()
  console.log("OUTPUT:")
  console.log("New Contract Address: ", res)
  console.log("\n\n\n")
  var stream = fs.createWriteStream(__dirname+"/contractAddress.txt");
  stream.write(res);
  stream.close();
}


async function queryAliceBobAddressBalance() {
  console.log("--------------------Transfer 0.01 Eth to Alice for Paying Transaction Service Fee--------------------")
  console.log("INPUT:")
  console.log("From: ", BobAddress)
  console.log("To: ", AliceAddress)
  console.log("Value: ", "0.01Eth")
  console.log("gasLimit: ", 150000+"\n")
  let res = await feeTransfer()
  console.log("OUTPUT:")
  if(res.status == true) {
    console.log("Successfully Transferred Fee 2 Alice, Transaction Hash Is: ", res.transactionHash)
    console.log("\n\n\n")
  }
  console.log("--------------------Using Facet to Recharge 5 Eth for Bob--------------------")
  res = await ethFaucet(BobAddress, "5")
  console.log("OUTPUT:")
  if (res.status == true) {
    console.log("Successfully Recharged for Bob, Transaction Hash Is: ", res.transactionHash)
    console.log("\n\n\n")
  }
  console.log("--------------------Get Alice's Balance on Ethereum--------------------")
  console.log("INPUT:")
  console.log("Alice's Address: ", AliceAddress, "\n")
  console.log("OUTPUT:")
  console.log("Alice's Balance:", await getBalance(AliceAddress), "\n\n\n")
  console.log("--------------------Get Bob's Balance on Ethereum--------------------")
  console.log("INPUT:")
  console.log("Bob's Address: ", BobAddress+"\n")
  console.log("OUTPUT:")
  console.log("Bob's Balance: ", await getBalance(BobAddress), "\n\n\n")
}


async function pre() {
  console.log("<<<<<--------------------------Preparation-------------------------->>>>>")
  console.log("\n\n")
  await createAliceBobAccounts()
  await recharge1K2Alice()
  await queryAliceBobAccount()
  await queryAliceBobAddressBalance()
  await deploy()
}

pre()