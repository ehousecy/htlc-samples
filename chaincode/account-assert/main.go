package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	AccountPrefix = "Account-%s"
	InitAccountAddress = "account-assert-genesis-account"
	InitAccountPassword = "12345678"
	InitAccountToken = 10000000000
)

type AccountAssert struct{}

func (a *AccountAssert) Init(stub shim.ChaincodeStubInterface) pb.Response {
	pass := sha256.Sum256([]byte(InitAccountPassword))
	initAccount := Account{
		Address: InitAccountAddress,
		Passwd: hex.EncodeToString(pass[:]),
		Amount: uint64(InitAccountToken),
	}

	key := fmt.Sprintf(AccountPrefix, InitAccountAddress)
	initAccountInfo, err := json.Marshal(initAccount)
	if err != nil {
	}

	err = stub.PutState(key, initAccountInfo)
	if err != nil {
		return a.defaultInit()
	}

	return shim.Success([]byte("Init Success"))
}

func (a *AccountAssert) Invoke(stub shim.ChaincodeStubInterface) (res pb.Response) {
	return
}

func main() {
	if err := shim.Start(new(AccountAssert)); err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}
