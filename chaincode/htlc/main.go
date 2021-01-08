package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	AccountChainCodeName    = "account"
	AccountChainCodeChannel = "mychannel"

	HTLCPrefix = "HTLC-%s"
)

type HTLCChaincode struct{}

func (h *HTLCChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (h *HTLCChaincode) Invoke(stub shim.ChaincodeStubInterface) (res pb.Response) {
	fn, args := stub.GetFunctionAndParameters()
	switch fn {
	case "createmidaccount":
		res = h.createMidAccount(stub, args)
	case "create":
		res = h.create(stub, args)
	case "createhash":
		res = h.createHash(stub, args)
	case "receive":
		res = h.receive(stub, args)
	case "refund":
		res = h.refund(stub, args)
	case "queryhtlc":
		res = h.query(stub, args)
	default:
		res = shim.Error("Invalid invoke function name")
	}

	return
}

func (h *HTLCChaincode) createMidAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 3 {
		return shim.Error("arguments is invalid")
	}
	sender := args[0]
	preImage := args[1]
	flag := args[2]

	trans := [][]byte{[]byte("query"), []byte(sender)}
	resPonse := stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc query sender account error: " + resPonse.Message)
	}

	senderAccount := &Account{}
	if err := json.Unmarshal(resPonse.Payload, senderAccount); err != nil {
		return shim.Error(err.Error())
	}

	midAddress := senderAccount.Address + uint64ToString(senderAccount.Sequence)

	trans = [][]byte{[]byte("register"), []byte(midAddress), []byte(preImage), []byte(flag)}
	resPonse = stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc register mid account error: " + resPonse.Message)
	}

	trans = [][]byte{[]byte("sequenceadd"), []byte(sender)}
	resPonse = stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc update sender account sequence error: " + resPonse.Message)
	}

	return shim.Success([]byte(midAddress))
}

func (h *HTLCChaincode) create(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 7 {
		return shim.Error("arguments is invalid")
	}

	sender := args[0]
	receive := args[1]
	amountStr := args[2]
	timeLockStr := args[3]
	preImage := args[4]
	passwd := args[5]
	midaddress := args[6]

	trans := [][]byte{[]byte("query"), []byte(sender)}
	resPonse := stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc query sender account error: " + resPonse.Message)
	}

	senderAccount := &Account{}
	if err := json.Unmarshal(resPonse.Payload, senderAccount); err != nil {
		return shim.Error(err.Error())
	}

	amount, err := stringToUint64(amountStr)
	if err != nil {
		return shim.Error(err.Error())
	}

	if amount > senderAccount.Amount {
		return shim.Error("account assert is not enough")
	}

	trans = [][]byte{[]byte("transfer"), []byte(sender), []byte(midaddress), []byte(amountStr), []byte(passwd)}
	resPonse = stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc transfer mid  account error:" + resPonse.Message)
	}

	hashValueBytes := sha256.Sum256([]byte(preImage))
	hashValue := hex.EncodeToString(hashValueBytes[:])

	timeLock, err := strconv.ParseInt(timeLockStr, 10, 64)
	if err != nil {
		return shim.Error(err.Error())
	}
	timeLock = time.Now().Unix() + timeLock

	htlc := HTLC{
		Sender:      sender,
		Receiver:    receive,
		Amount:      amount,
		HashValue:   hashValue,
		TimeLock:    timeLock,
		PreImage:    "",
		LockAddress: midaddress,
		State:       HashLOCK,
	}

	htlcByte, err := json.Marshal(htlc)
	idByte := sha256.Sum256(htlcByte)
	id := hex.EncodeToString(idByte[:])
	key := fmt.Sprintf(HTLCPrefix, id)

	if err := stub.PutState(key, htlcByte); err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(id))
}

func (h *HTLCChaincode) createHash(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 7 {
		return shim.Error("arguments is invalid")
	}

	sender := args[0]
	receive := args[1]
	amountStr := args[2]
	timeLockStr := args[3]
	hashValue := args[4]
	passwd := args[5]
	midaddress := args[6]

	trans := [][]byte{[]byte("query"), []byte(sender)}
	resPonse := stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Success([]byte(resPonse.Message))
	}

	senderAccount := &Account{}
	if err := json.Unmarshal(resPonse.Payload, senderAccount); err != nil {
		return shim.Error(err.Error())
	}

	amount, err := stringToUint64(amountStr)
	if err != nil {
		return shim.Error(err.Error())
	}

	if amount > senderAccount.Amount {
		return shim.Error("account assert is not enough")
	}

	trans = [][]byte{[]byte("transfer"), []byte(sender), []byte(midaddress), []byte(amountStr), []byte(passwd)}
	resPonse = stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Error("craete htlc transfer mid  account error:" + resPonse.Message)
	}

	timeLock, err := strconv.ParseInt(timeLockStr, 10, 64)
	if err != nil {
		return shim.Error(err.Error())
	}

	timeLock = time.Now().Unix() + timeLock

	htlc := HTLC{
		Sender:      sender,
		Receiver:    receive,
		Amount:      amount,
		HashValue:   hashValue,
		TimeLock:    timeLock,
		PreImage:    "",
		LockAddress: midaddress,
		State:       HashLOCK,
	}

	htlcByte, err := json.Marshal(htlc)
	idByte := sha256.Sum256(htlcByte)
	id := hex.EncodeToString(idByte[:])
	key := fmt.Sprintf(HTLCPrefix, id)

	if err := stub.PutState(key, htlcByte); err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(id))
}

func (h *HTLCChaincode) receive(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 2 {
		return shim.Error("argument is invalid")
	}

	id := args[0]
	preImage := args[1]

	key := fmt.Sprintf(HTLCPrefix, id)
	htlcByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	if htlcByte == nil {
		return shim.Error("not have this htlc transaction")
	}

	htlc := &HTLC{}
	if err = json.Unmarshal(htlcByte, htlc); err != nil {
		return shim.Error(err.Error())
	}

	if htlc.State != HashLOCK {
		return shim.Error("this htlc transaction state is error")
	}

	if htlc.TimeLock < time.Now().Unix() {
		return shim.Error("time is expirate")
	}

	trans := [][]byte{[]byte("transfer"), []byte(htlc.LockAddress), []byte(htlc.Receiver), []byte(uint64ToString(htlc.Amount)), []byte(preImage)}
	resPonse := stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Success([]byte(resPonse.Message))
	}

	htlc.PreImage = preImage
	htlc.State = Received
	htlcByte, err = json.Marshal(htlc)
	if err != nil {
		return shim.Error(err.Error())
	}
	if err = stub.PutState(key, htlcByte); err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Receive HTLC success."))
}

func (h *HTLCChaincode) refund(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 2 {
		return shim.Error("argument is invalid")
	}

	id := args[0]
	preImage := args[1]

	key := fmt.Sprintf(HTLCPrefix, id)
	htlcByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	if htlcByte == nil {
		return shim.Error("not have this htlc transaction")
	}

	htlc := &HTLC{}
	if err = json.Unmarshal(htlcByte, htlc); err != nil {
		return shim.Error(err.Error())
	}

	if htlc.TimeLock > time.Now().Unix() {
		return shim.Error("time is not expirate")
	}

	trans := [][]byte{[]byte("transfer"), []byte(htlc.LockAddress), []byte(htlc.Sender), []byte(uint64ToString(htlc.Amount)), []byte(preImage)}
	resPonse := stub.InvokeChaincode(AccountChainCodeName, trans, AccountChainCodeChannel)
	if resPonse.Status != shim.OK {
		return shim.Success([]byte(resPonse.Message))
	}

	htlc.State = Refund
	if htlcByte, err = json.Marshal(htlc); err != nil {
		return shim.Error(err.Error())
	}
	if err = stub.PutState(key, htlcByte); err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Refund Success."))
}

func (h *HTLCChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("argument is invalid")
	}

	key := fmt.Sprintf(HTLCPrefix, args[0])
	htlcByte, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	if htlcByte == nil {
		return shim.Error("not have this htlc transaction")
	}

	return shim.Success(htlcByte)
}

func stringToUint64(s string) (u uint64, err error) {
	u, err = strconv.ParseUint(s, 10, 64)
	return
}

func uint64ToString(u uint64) string {
	return strconv.FormatUint(u, 10)
}

func main() {
	err := shim.Start(new(HTLCChaincode))
	if err != nil {
		fmt.Printf("Error starting HTLC chaincode: %s", err)
	}
}
