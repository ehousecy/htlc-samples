import { 
  createAccount,
  queryAccount,
  createMidAccount,
  createHTLC,
  withdraw,
  refund,
  QueryHTLC,
  faucet
} from '../utils/Ifabric'

async function testWf() {
  createAccount("qqa", "aabc")
  createAccount("qqb", "babc")
  queryAccount("qqa")
  queryAccount("qqb")
  faucet("qqa", "1000")
  createMidAccount("qqa", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "hash")
  createHTLC("qqa", "qqb", "100", "2000", "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18", "aabc", "qqa0");
  withdraw("8659f8056bfb94b143bd3f0fb36236862614eb303434fe5322dd9ab6715fbc6e", "rootroot")
  queryAccount("qqa")
  queryAccount("qqb")
}

testWf
