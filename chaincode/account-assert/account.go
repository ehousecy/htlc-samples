package main

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

type Account struct {
	Address  string `json:"address"`
	Amount   uint64 `json:"amount"`
	Passwd   string `json:"passwd"`
	Sequence uint64 `json:"sequence"`
}

func (a *Account) Transfer(stub shim.ChaincodeStubInterface, to *Account, amount uint64) error {
	sendKey := fmt.Sprintf(AccountPrefix, a.Address)
	a.Amount = safeSub(a.Amount, amount)

	receiverKey := fmt.Sprintf(AccountPrefix, to.Address)
	to.Amount = safeAdd(to.Amount, amount)

	senderInfo, err := json.Marshal(a)
	if err != nil {
		return err
	}

	receiverInfo, err := json.Marshal(to)
	if err != nil {
		return err
	}

	err = stub.PutState(sendKey, senderInfo)
	err = stub.PutState(receiverKey, receiverInfo)

	return err
}

func safeAdd(a uint64, b uint64) uint64 {
	c := a + b
	if c < a {
		panic(errors.New("balance overflow"))
	}
	return c
}

func safeSub(a uint64, b uint64) uint64 {
	if b > a {
		panic(errors.New("insufficient balance"))
	}
	return a - b
}
