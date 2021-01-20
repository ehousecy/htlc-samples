var rp = require('request-promise')
let ip = "http://172.30.4.135:9090"

async function createAccount(accountName:string, passwd:string) {
  let requestJsonBody = {
    "address": accountName,
    "passwd": passwd,
	  "flag":""
  }
  var options = {
    method: 'POST',
    uri: ip + "/account/create",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };
  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function queryAccount(accountName:string) {
  let requestJsonBody = {
    "address": accountName
  }
  var options = {
    method: 'POST',
    uri: ip + "/account/query",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
      
}

async function createMidAccount(sender:string, preImage:string, flag:string) {
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

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function createHTLC(sender:string, receiver:string, amount:string, ttl:string, hash:string, passwd:string, mid_address:string) {
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

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function withdraw(id:string, preImage:string) {
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

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function refund(id:string, preImage:string) {
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

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function QueryHTLC(id:string) {
  let requestJsonBody = {
  	"id": id
  }

  var options = {
    method: 'POST',
    uri: ip + "/htlc/query",
    body: requestJsonBody,
    json: true // Automatically parses the JSON string in the response
  };

  try {
    return await rp(options)
  } catch (error) {
    return error
  }
}

async function faucet(to:string, amount:string) { 
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
  try {
    let res = await rp(options)
    console.log(res)
    return res  
  } catch (error) {
    console.log(error)
  }
}

// createAccount("qqa", "aabc")
// createAccount("qqb", "babc")
// queryAccount("qqa")
// queryAccount("qqb")
// faucet("qqa", "1000")
// createMidAccount("qqa", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "hash")
// createHTLC("qqa", "qqb", "100", "2000", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "aabc", "qqa0");
// withdraw("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e", "rootroot")
// queryAccount("qqa")
// queryAccount("qqb")


export { 
  createAccount,
  queryAccount,
  createMidAccount,
  createHTLC,
  withdraw,
  refund,
  QueryHTLC,
  faucet
}