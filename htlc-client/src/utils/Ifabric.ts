import { ResponseDto } from "./responseDto/response"

var rp = require('request-promise')
let ip = "http://172.30.4.135:9090"

async function sendRequest(options:any):Promise<ResponseDto<any>> {
  let resp:ResponseDto<any>
  try {
    let res = await rp(options)
    return resp = {
      code: 200,
      data: res.data,
      err: ''
    }
  } catch (error) {
    return resp = {
      code: 400,
      data: error.stack,
      err: error.message
    }
  }
}

async function createAccount(accountName:string, passwd:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
    "address": accountName,
    "passwd": passwd,
	  "flag": ""
  }
  var options = {
    method: 'POST',
    uri: ip + "/account/create",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function queryAccount(accountName:string) : Promise<ResponseDto<any>> {
  let requestJsonBody = {
    "address": accountName
  }
  var options = {
    method: 'POST',
    uri: ip + "/account/query",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)    
}

async function createMidAccount(sender:string, preImage:string, flag:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
    "sender": sender,
    "pre_image": preImage,
    "flag": flag
  }
  var options = {
    method: 'POST',
    uri: ip + "/htlc/midaccount",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function createHTLC(sender:string, receiver:string, amount:string, ttl:string, hash:string, passwd:string, mid_address:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
    "sender": sender,
    "receiver": receiver,
    "amount": amount, 
    "ttl": ttl, 
    "hash": hash, 
    "passwd": passwd, 
    "mid_address": mid_address 
  }

  var options = {
    method: 'POST',
    uri: ip + "/htlc/createbyhash",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function withdrawFabricAssets(id:string, preImage:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
  	"id": id,
	  "pre_image": preImage
  }

  var options = {
    method: 'POST',
    uri: ip + "/htlc/withdraw",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function refund(id:string, preImage:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
  	"id": id,
	  "pre_image": preImage
  }

  var options = {
    method: 'POST',
    uri: ip + "/htlc/refund",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function QueryHTLC(id:string):Promise<ResponseDto<any>> {
  let requestJsonBody = {
  	"id": id
  }

  var options = {
    method: 'POST',
    uri: ip + "/htlc/query",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

async function faucet(to:string, amount:string):Promise<ResponseDto<any>> { 
  let requestJsonBody = {
    "from": "account-assert-genesis-account",
    "to": to,
    "amount": amount,
    "passwd": "12345678"
  }

  var options = {
    method: 'POST',
    uri: ip + "/account/transfer",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  return await sendRequest(options)
}

createAccount("asadasdazqb", "babc")
// queryAccount("zqa")
// queryAccount("zqb")
// faucet("zqa", "1000")
// createMidAccount("zqa", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "hash")
// createHTLC("zqa", "zqb", "100", "2000", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "aabc", "zqa0");
// withdraw("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e", "rootroot")
// queryAccount("zqa")
// queryAccount("zqb")


export { 
  createAccount,
  queryAccount,
  createMidAccount,
  createHTLC,
  withdrawFabricAssets,
  refund,
  QueryHTLC,
  faucet
}
