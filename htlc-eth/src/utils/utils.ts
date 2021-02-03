import {htlcAbi, htlcCode} from './htlcContractInfo'
import {node1} from './nodeList'
import { BobAddress,AliceAddress,minerAddress,BobPrivateKey,AlicePrivateKey,minerPrivateKey } from "./accountList"

var Web3 = require('web3')
var web3 = new Web3(node1)

function hex2Utf8(hex:string) { 
	return web3.utils.hexToUtf8(hex)
}

function addDefaultWallet() {
	web3.eth.accounts.wallet.add({
		privateKey: BobPrivateKey,
		address: BobAddress
	})

	web3.eth.accounts.wallet.add({
		privateKey: AlicePrivateKey,
		address: AliceAddress
	})

	web3.eth.accounts.wallet.add({
		privateKey: minerPrivateKey,
		address: minerAddress
	})
}
addDefaultWallet()

function addWallet(privateKey:string, address:string) {
	web3.eth.accounts.wallet.add({
		privateKey: privateKey,
		address: address
	})
}

async function getBalance(_address: string) {
	try {
		let res = await web3.eth.getBalance(_address)	
		return web3.utils.fromWei(res, 'ether');
	} catch (error) {
		return error
	}
}

async function feeTransfer() {
	try {
		let val = web3.utils.toWei("0.01")

		return await web3.eth.sendTransaction({
			from: minerAddress,
			to: AliceAddress,
			value: val,				
			gas: 1500000,
			gasPrice: '300000000'
		})
	} catch (error) {
		console.log(error)
		return error
	}
}

async function ethFaucet(_address:string, _amount:string) {
	try {
		web3.eth.accounts.wallet.add({
			privateKey: minerPrivateKey,
			address: minerAddress
		})
		let val = web3.utils.toWei(_amount)
		return await web3.eth.sendTransaction({
			from: minerAddress,
			to: _address,
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
				from: BobAddress,
				gas: 1500000,
				gasPrice: '300000000'
			})
			let htlcAddress = res._address
			myContract = new web3.eth.Contract(htlcAbi, htlcAddress)
			return htlcAddress

	} catch (error) {
		console.log(error)
		return error
	}
}

function makeContract(contractAddress:string) {
	myContract = new web3.eth.Contract(htlcAbi, contractAddress)
}

async function newHTLC(receiver: string, hashLock: string, timestamp: string | number, ethAmount: string, txSender: string) {
	try {
		let wei = web3.utils.toWei(ethAmount, 'ether');
		return await myContract.methods.newHTLC(receiver,hashLock,timestamp).send({
			from: txSender,
			gas: 3500000,
			gasPrice: '30000',
			value: wei
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
	hex2Utf8,
	addWallet,
	feeTransfer,
	ethFaucet,
	deployHTLC,
	makeContract,
	newHTLC,
	withdrawEthAssets,
	getTransaction,
	getTransactionFromBlock,
	queryNewHTLCEvent,
	getContract,
	getBalance
}

