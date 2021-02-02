const fs = require('fs');
import { AliceAccount, AlicePasswd, BobAccount, BobPasswd } from '../utils/accounts'

// Alice&Bob's address&privateKey on ethereum
import { BobAddress, BobPrivateKey, AliceAddress, AlicePrivateKey} from '../../../htlc-eth/src/utils/accountList'

import { createAccount, queryAccount, faucet } from "../utils/Ifabric"
import { getBalance, feeTransfer, deployHTLC } from "../../../htlc-eth/src/utils/utils"

async function createAliceBobAccounts() { 
  console.log("--------------------Create Alice Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice Account: ", AliceAccount)
  console.log("Alice PassWord: ", AlicePasswd)
  let res = await createAccount(AliceAccount, AlicePasswd)
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
  console.log("--------------------Create Bob Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Bob Account: ", AliceAccount)
  console.log("Bob PassWord: ", AlicePasswd)
  console.log(await createAccount(BobAccount, BobPasswd), "\n\n\n")
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
}

async function charge1K2Alice() {
  console.log("--------------------Using Faucet to Charge 1000 Assets 2 Alice on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice Account: ", AliceAccount)
  console.log("Assets Amount: ", "1000"+"\n")
  let res = await faucet(AliceAccount, "1000")
  console.log("OUTPUT:")
  console.log(res.data, "\n\n\n")
}

async function queryAliceBobAccount() {
  console.log("--------------------Query Alice Account on Fabric--------------------")
  console.log("INPUT:")
  console.log("Alice Account: ", AliceAccount+"\n")
  console.log("OUTPUT:\n", await queryAccount(AliceAccount), "\n\n\n")
  console.log("--------------------Query Bob Account on Fabric--------------------")
  console.log(await queryAccount(BobAccount), "\n\n\n")
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
  console.log("--------------------Transfer a few Eth to Alice for Paying Transaction Service Fee--------------------")
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
  console.log("--------------------Get Alice's Balance on Ethereum--------------------")
  console.log("INPUT:")
  console.log("Alice's Address: ", AliceAddress+"\n")
  console.log("OUTPUT:\n", await getBalance(AliceAddress)+"\n\n\n")
  console.log("--------------------Get Bob's Balance on Ethereum--------------------")
  console.log("INPUT:")
  console.log("Bob's Address: ", BobAddress+"\n")
  console.log("OUTPUT:\n", await getBalance(BobAddress)+"\n\n\n")
}


async function pre() {
  console.log("<<<<<--------------------------Preparation-------------------------->>>>>")
  console.log("\n\n")
  await createAliceBobAccounts()
  await charge1K2Alice()
  await queryAliceBobAccount()
  await deploy()
  await queryAliceBobAddressBalance()
}

pre()