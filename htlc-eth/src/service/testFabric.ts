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

async function QueryAccount(address:string) { 
  let account = await queryAccount(address)
  let add = JSON.parse(JSON.stringify(account.data)).address
  // account = JSON.parse(JSON.stringify(account))
  if (add == '') {
    console.log("账户不存在")
  }
  console.log(add)
  return add == address
}
async function testWf() {
  
  // console.log(await createAccount("asender", "passwd1"))
  // console.log(await faucet("asdas", "1000"))
  // console.log(await createAccount("receiver", "passwd2"))
  // console.log(await QueryAccount("sender"))
  // console.log(await QueryAccount("receiver"))
  // console.log(await queryAccount("aqc"))
  // console.log(await createMidAccount("sender", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "hash"))
  // console.log(await createHTLC("receiver", "aqc", "100", "2000", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "passwd1", "sender0"))
  // console.log(await withdrawFabricAssets("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e", "rootroot"))
  // console.log(await QueryHTLC("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e"))
  // console.log(await refund("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e", "rootroot"))
}

testWf()
