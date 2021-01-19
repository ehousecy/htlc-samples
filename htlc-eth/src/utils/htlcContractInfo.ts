let htlcAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"htlcId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hashlock","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"LogHTLCNew","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"htlcId","type":"bytes32"}],"name":"LogHTLCRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"htlcId","type":"bytes32"}],"name":"LogHTLCWithdraw","type":"event"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"_htlcId","type":"bytes32"}],"name":"getContract","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"hashlock","type":"bytes32"},{"internalType":"uint256","name":"timelock","type":"uint256"},{"internalType":"bool","name":"withdrawn","type":"bool"},{"internalType":"bool","name":"refunded","type":"bool"},{"internalType":"bytes","name":"preimage","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_receiver","type":"address"},{"internalType":"bytes32","name":"_hashlock","type":"bytes32"},{"internalType":"uint256","name":"_timelock","type":"uint256"}],"name":"newHTLC","outputs":[{"internalType":"bytes32","name":"htlcId","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_htlcId","type":"bytes32"}],"name":"refund","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"_htlcId","type":"bytes32"},{"internalType":"bytes","name":"_preimage","type":"bytes"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

let htlcCode = "608060405234801561001057600080fd5b506114d9806100206000396000f3fe60806040526004361061003f5760003560e01c80634a2e35ba146100445780637249fbb6146100ec5780637b3a406d1461013f578063e16c7d98146101ab575b600080fd5b34801561005057600080fd5b506100d26004803603604081101561006757600080fd5b81019080803590602001909291908035906020019064010000000081111561008e57600080fd5b8201836020820111156100a057600080fd5b803590602001918460018302840111640100000000831117156100c257600080fd5b90919293919293905050506102f0565b604051808215151515815260200191505060405180910390f35b3480156100f857600080fd5b506101256004803603602081101561010f57600080fd5b8101908080359060200190929190505050610818565b604051808215151515815260200191505060405180910390f35b6101956004803603606081101561015557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919080359060200190929190505050610bee565b6040518082815260200191505060405180910390f35b3480156101b757600080fd5b506101e4600480360360208110156101ce57600080fd5b81019080803590602001909291905050506110b4565b604051808973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001841515151581526020018315151515815260200180602001828103825283818151815260200191508051906020019080838360005b838110156102ae578082015181840152602081019050610293565b50505050905090810190601f1680156102db5780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b6000836102fc8161129a565b61036e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f68746c63496420646f6573206e6f74206578697374000000000000000000000081525060200191505060405180910390fd5b8484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506002816040516020018082805190602001908083835b602083106103ed57805182526020820191506020810190506020830392506103ca565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040526040518082805190602001908083835b602083106104545780518252602082019150602081019050602083039250610431565b6001836020036101000a038019825116818451168082178552505050505050905001915050602060405180830381855afa158015610496573d6000803e3d6000fd5b5050506040513d60208110156104ab57600080fd5b81019080805190602001909291905050506000808481526020019081526020016000206003015414610545576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601c8152602001807f686173686c6f636b206861736820646f6573206e6f74206d617463680000000081525060200191505060405180910390fd5b863373ffffffffffffffffffffffffffffffffffffffff1660008083815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461061c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f776974686472617761626c653a206e6f7420726563656976657200000000000081525060200191505060405180910390fd5b6000151560008083815260200190815260200160002060050160009054906101000a900460ff161515146106b8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f776974686472617761626c653a20616c72656164792077697468647261776e0081525060200191505060405180910390fd5b426000808381526020019081526020016000206004015411610725576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806114746031913960400191505060405180910390fd5b60008060008a81526020019081526020016000209050878782600601919061074e929190611308565b5060018160050160006101000a81548160ff0219169083151502179055508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600201549081150290604051600060405180830381858888f193505050501580156107da573d6000803e3d6000fd5b50887fd6fd4c8e45bf0c70693141c7ce46451b6a6a28ac8386fca2ba914044e0e2391660405160405180910390a26001955050505050509392505050565b6000816108248161129a565b610896576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f68746c63496420646f6573206e6f74206578697374000000000000000000000081525060200191505060405180910390fd5b823373ffffffffffffffffffffffffffffffffffffffff1660008083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461096d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f726566756e6461626c653a206e6f742073656e6465720000000000000000000081525060200191505060405180910390fd5b6000151560008083815260200190815260200160002060050160019054906101000a900460ff16151514610a09576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601c8152602001807f726566756e6461626c653a20616c726561647920726566756e6465640000000081525060200191505060405180910390fd5b6000151560008083815260200190815260200160002060050160009054906101000a900460ff16151514610aa5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f726566756e6461626c653a20616c72656164792077697468647261776e00000081525060200191505060405180910390fd5b42600080838152602001908152602001600020600401541115610b13576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806114516023913960400191505060405180910390fd5b6000806000868152602001908152602001600020905060018160050160016101000a81548160ff0219169083151502179055508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600201549081150290604051600060405180830381858888f19350505050158015610bb4573d6000803e3d6000fd5b50847f989b3a845197c9aec15f8982bbb30b5da714050e662a7a287bb1a94c81e2e70e60405160405180910390a260019350505050919050565b6000803411610c65576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f6d73672e76616c7565206d757374206265203e2030000000000000000000000081525060200191505060405180910390fd5b81428111610cbe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602381526020018061142e6023913960400191505060405180910390fd5b60023386348787604051602001808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660601b81526014018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660601b8152601401848152602001838152602001828152602001955050505050506040516020818303038152906040526040518082805190602001908083835b60208310610d915780518252602082019150602081019050602083039250610d6e565b6001836020036101000a038019825116818451168082178552505050505050905001915050602060405180830381855afa158015610dd3573d6000803e3d6000fd5b5050506040513d6020811015610de857600080fd5b81019080805190602001909291905050509150610e048261129a565b15610e77576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f436f6e747261637420616c72656164792065786973747300000000000000000081525060200191505060405180910390fd5b6040518061010001604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1681526020013481526020018581526020018481526020016000151581526020016000151581526020016040518060400160405280600381526020017f307830000000000000000000000000000000000000000000000000000000000081525081525060008084815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a08201518160050160006101000a81548160ff02191690831515021790555060c08201518160050160016101000a81548160ff02191690831515021790555060e0820151816006019080519060200190611032929190611388565b509050508473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16837f329a8316ed9c3b2299597538371c2944c5026574e803b1ec31d6113e1cd67bde34888860405180848152602001838152602001828152602001935050505060405180910390a4509392505050565b60008060008060008060006060600015156110ce8a61129a565b151514156111445760606040518060400160405280600381526020017f307830000000000000000000000000000000000000000000000000000000000081525090506000806000806000806000878797508696508595508460001b9450839350985098509850985098509850985098505061128f565b60008060008b815260200190815260200160002090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168260020154836003015484600401548560050160009054906101000a900460ff168660050160019054906101000a900460ff1687600601879750869650808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112765780601f1061124b57610100808354040283529160200191611276565b820191906000526020600020905b81548152906001019060200180831161125957829003601f168201915b5050505050905098509850985098509850985098509850505b919395975091939597565b60008073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061134957803560ff1916838001178555611377565b82800160010185558215611377579182015b8281111561137657823582559160200191906001019061135b565b5b5090506113849190611408565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106113c957805160ff19168380011785556113f7565b828001600101855582156113f7579182015b828111156113f65782518255916020019190600101906113db565b5b5090506114049190611408565b5090565b61142a91905b8082111561142657600081600090555060010161140e565b5090565b9056fe74696d656c6f636b2074696d65206d75737420626520696e2074686520667574757265726566756e6461626c653a2074696d656c6f636b206e6f742079657420706173736564776974686472617761626c653a2074696d656c6f636b2074696d65206d75737420626520696e2074686520667574757265a265627a7a723158209cf91b1c00cecd3cedbba2c415a8dff90795ba20a80893340d4f4af3c5685f2b64736f6c63430005110032"

export {
    htlcAbi,
    htlcCode
}