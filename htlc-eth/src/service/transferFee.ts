import {feeTransfer} from '../utils/utils'

async function transferFee2Address2() {
    let res = await feeTransfer()
    console.log(res)
    console.log("")
    console.log("")
    console.log("")
}

transferFee2Address2()