package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	AccountPrefix       = "Account-%s"
	InitAccountAddress  = "account-assert-genesis-account"
	InitAccountPassword = "12345678"
	InitAccountToken    = 10000000000
)

type AccountAssert struct{}

func (a *AccountAssert) Init(stub shim.ChaincodeStubInterface) pb.Response {
	pass := sha256.Sum256([]byte(InitAccountPassword))
	initAccount := Account{
		Address: InitAccountAddress,
		Passwd:  hex.EncodeToString(pass[:]),
		Amount:  uint64(InitAccountToken),
		Sequence: 0,
		Type: GenAccount,
		TransferTo: [2]string{},
	}

	key := fmt.Sprintf(AccountPrefix, InitAccountAddress)
	initAccountInfo, err := json.Marshal(initAccount)
	if err != nil {
		return shim.Error("json marshal error: " + err.Error())
	}

	err = stub.PutState(key, initAccountInfo)
	if err != nil {
		return shim.Error("put state error: " + err.Error())
	}

	return shim.Success([]byte("Init Success"))
}

func (a *AccountAssert) Invoke(stub shim.ChaincodeStubInterface) (res pb.Response) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("panic: %v\n", r)
		}
	}()

	fn, args := stub.GetFunctionAndParameters()
	switch fn {
	case "registermidaccount":
		res = a.createMidAccount(stub, args)
	case "register":
		res = a.createAccount(stub, args)
	case "transfer":
		res = a.transfer(stub, args)
	case "query":
		res = a.query(stub, args)
	case "sequenceadd":
		res = a.sequenceAdd(stub, args)
	default:
		res = shim.Error("function name is not valid")
	}

	return
}

func (a *AccountAssert) createMidAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 5 {
		return shim.Error("arguments is invalid")
	}

	var pw string

	address := args[0]
	passwd := args[1]
	flag := args[2]
	sender := args[3]
	receiver := args[4]

	key := fmt.Sprintf(AccountPrefix, address)
	accByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if accByte != nil {
		return shim.Error("account is exist")
	}

	if flag == "hash" {
		pw = passwd
	} else {
		sha256Passwd := sha256.Sum256([]byte(passwd))
		pw = hex.EncodeToString(sha256Passwd[:])
	}

	transferTo := [2]string{sender, receiver}
	acc := Account{
		Address:  address,
		Amount:   0,
		Passwd:   pw,
		Sequence: 0,
		Type: MidAccount,
		TransferTo: transferTo,
	}
	if accByte, err = json.Marshal(acc); err != nil {
		return shim.Error(err.Error())
	}

	if err = stub.PutState(key, accByte); err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("success create mid account"))
}

func (a *AccountAssert) createAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 2 {
		return shim.Error("arguments is invalid")
	}

	address := args[0]
	key := fmt.Sprintf(AccountPrefix, address)
	accByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	if accByte != nil {
		return shim.Error("account is exist")
	}

	passwd := args[1]
	sha256Passwd := sha256.Sum256([]byte(passwd))

	acc := Account{
		Address:  address,
		Amount:   0,
		Passwd:   hex.EncodeToString(sha256Passwd[:]),
		Sequence: 0,
		Type: GenAccount,
		TransferTo: [2]string{},
	}

	if accByte, err = json.Marshal(acc); err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("account: ", string(accByte))

	if err = stub.PutState(key, accByte); err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("success create account"))
}

func (a *AccountAssert) transfer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 4 {
		return shim.Error("argument is invalid")
	}

	from := args[0]
	to := args[1]
	amountStr := args[2]
	passwd := args[3]

	fromKey := fmt.Sprintf(AccountPrefix, from)
	senderInfo, err := stub.GetState(fromKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	if senderInfo == nil {
		return shim.Error("sender account is not exist")
	}

	sender := &Account{}
	err = json.Unmarshal(senderInfo, sender)
	if err != nil {
		return shim.Error(err.Error())
	}

	sha256Passwd := sha256.Sum256([]byte(passwd))
	if strings.Compare(sender.Passwd, hex.EncodeToString(sha256Passwd[:])) != 0 {
		return shim.Error("sender account passwd is error")
	}

	toKey := fmt.Sprintf(AccountPrefix, to)
	receiverInfo, err := stub.GetState(toKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	if receiverInfo == nil {
		return shim.Error("receive account is not exist")
	}

	receiver := &Account{}
	err = json.Unmarshal(receiverInfo, receiver)
	if err != nil {
		return shim.Error(err.Error())
	}

	amount, err := stringToUint64(amountStr)
	if err != nil {
		return shim.Error("transfer amount is error")
	}
	if sender.Amount < amount {
		return shim.Error("account amount is small")
	}

	if sender.Type == MidAccount {
		if sender.TransferTo[0] != sender && sender.TransferTo[1] != to {
			return shim.Error("mid account not can transfer to other account")
		}
	}

	err = sender.Transfer(stub, receiver, amount)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Transfer Success"))
}

func (a *AccountAssert) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("argument is invalid")
	}

	address := args[0]
	key := fmt.Sprintf(AccountPrefix, address)
	accByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if accByte == nil {
		return shim.Success([]byte("account is not exist"))
	}

	return shim.Success(accByte)
}

func (a *AccountAssert) sequenceAdd(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("argument is invalid")
	}

	address := args[0]
	key := fmt.Sprintf(AccountPrefix, address)
	accByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if accByte == nil {
		return shim.Success([]byte("account is not exist"))
	}

	account := &Account{}
	err = json.Unmarshal(accByte, account)
	if err != nil {
		return shim.Error(err.Error())
	}

	account.Sequence++

	accByte, err = json.Marshal(account)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, accByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(accByte)
}

func stringToUint64(s string) (u uint64, err error) {
	u, err = strconv.ParseUint(s, 10, 64)
	return
}

func main() {
	if err := shim.Start(new(AccountAssert)); err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}
