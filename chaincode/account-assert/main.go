package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type AccountAssert struct{}

func (a *AccountAssert) Init(stub shim.ChaincodeStubInterface) pb.Response {
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
