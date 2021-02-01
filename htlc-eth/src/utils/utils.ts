import {htlcAbi, htlcCode} from './htlcContractInfo'
import {node1} from './nodeList'
import { address1,address2,address3,privateKey1,privateKey2,privateKey3 } from "./accountList"
import { time } from 'console'

var Web3 = require('web3')
var web3 = new Web3(node1)

function addDefaultWallet() {
	web3.eth.accounts.wallet.add({
		privateKey: privateKey1,
		address: address1
	})

	web3.eth.accounts.wallet.add({
		privateKey: privateKey2,
		address: address2
	})

	web3.eth.accounts.wallet.add({
		privateKey: privateKey3,
		address: address3
	})
}
addDefaultWallet()

function addWallet(privateKey:string, address:string) {
	web3.eth.accounts.wallet.add({
		privateKey: privateKey,
		address: address
	})
}

async function feeTransfer() {
	try {
		let val = web3.utils.toWei(web3.utils.toBN(1))

		return await web3.eth.sendTransaction({
			from: address1,
			to: address2,
			value: val,				
			gas: 1500000,
			gasPrice: '300000000'
		})
	} catch (error) {
		console.log(error)
		return error
	}
}

var myContract = new web3.eth.Contract(htlcAbi)
async function deployHTLC() {
	
	try {
			let res = await myContract.deploy({
				data: htlcCode
			}).send({
				from: address1,
				gas: 1500000,
				gasPrice: '300000000'
			})
			let htlcAddress = res._address
			console.log("new contract address: "+htlcAddress)
			myContract = new web3.eth.Contract(htlcAbi, htlcAddress)
			return htlcAddress

	} catch (error) {
		console.log(error)
		return error
	}
}

async function newHTLC(receiver: string, hashLock: string, timestamp: string | number, ethAmount: string, txSender: string) {
	console.log("receiver: "+receiver)
	console.log("hashLock: "+hashLock)
	console.log("txSender: "+txSender)

	try {
		return await myContract.methods.newHTLC(receiver,hashLock,timestamp).send({
			from: txSender,
			gas: 3500000,
			gasPrice: '30000',
			value: ethAmount
		})
	} catch (error) {
		console.log(error)
		return error
	}
}

async function withdrawEthAssets(htlcId: string, preimage: string, txSender: string) {
	try {
		return await myContract.methods.withdraw(htlcId,preimage).send({
			from: txSender,
			gas: 3500000,
			gasPrice: '300',
			value: 0
		})
	} catch (error) {
		return error
	}
}

async function queryNewHTLCEvent(_fromBlock:number|string, _toBlock:number|string) {

	try {
		
		console.log("fromBlock: ", _fromBlock)
		console.log("toBlock: ", _toBlock)
		return await myContract.getPastEvents('LogHTLCNew', {
			fromBlock: _fromBlock,
			toBlock: _toBlock
		})

	} catch (error) {
		return error
	}
}

async function getContract(htlcId:string, sender:string) {
	try {
		return await myContract.methods.getContract(htlcId).call({from: sender})
	} catch (error) {
		return error
	}
}

async function getTransaction(txHash:string) {
	try {
		return await web3.eth.getTransaction(txHash)		
	} catch (error) {
		return error
	}
}

async function getTransactionFromBlock(txHash:string, blockNum:number) {
	try {
		return await web3.eth.getTransactionFromBlock(txHash, blockNum)		
	} catch (error) {
		return error
	}
}


export {
	addWallet,
	feeTransfer,
	deployHTLC,
	newHTLC,
	withdrawEthAssets,
	getTransaction,
	getTransactionFromBlock,
	queryNewHTLCEvent,
	getContract,
}

