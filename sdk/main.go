package main

import (
	"encoding/json"
	"io/ioutil"
	
	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	
	"github.com/ehousecy/htlc-samples/sdk/sdk"
)

const (
	OrgName = "Org1"
	ChannelID = "mychannel"
	ChainCodeID_Account = "account"
	ChainCodeID_HTLC = "htlc"
	Peer = "peer0.org1.example.com"
	UserName = "Admin"

	Func_Account_Register = "register"
	Func_Account_Transfer = "transfer"
	Func_Account_Query = "query"
	Func_HTLC_CreateMidAccount = "createmidaccount"
	Func_HTLC_Create = "create"
	Func_HTLC_CreateHash = "createhash"
	Func_HTLC_Withdraw = "withdraw"
	Func_HTLC_Refund = "refund"
	Func_HTLC_Query = "queryhtlc"
)

var (
	err error

	fabSDK *fabsdk.FabricSDK
)

func init() {
	fabSDK, err = sdk.SetUpSDK("./config.yaml")
	if err != nil {
		panic("Init Fabric SDK error!" + err.Error())
	}
}

func main() {
	r := gin.Default()

	r.POST("/account/create", createAccount)
	r.POST("/account/transfer", transfer)
	r.POST("/account/query", queryAccount)

	r.POST("/htlc/midaccount", htlcCreateMidAccount)
	r.POST("/htlc/create", htlcCreate)
	r.POST("/htlc/createbyhash", htlcCreateByHash)
	r.POST("/htlc/withdraw", htlcWithdraw)
	r.POST("/htlc/refund", htlcRefund)
	r.POST("/htlc/query", htlcQuery)

	r.Run(":9090")
}

func createAccount(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_Account
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_Account_Register

	var account sdk.CreateAccountArgs
	account.Address = requestInfo["address"].(string)
	account.PassWD = requestInfo["passwd"].(string)
	account.Flag = requestInfo["flag"].(string)

	payload, err := sdk.RegisterAccount(fabSDK, &request, account)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func transfer(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_Account
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_Account_Transfer

	var account sdk.TransferArgs
	account.From = requestInfo["from"].(string)
	account.To = requestInfo["to"].(string)
	account.Amount = requestInfo["amount"].(string)
	account.Passwd = requestInfo["passwd"].(string)

	payload, err := sdk.Transfer(fabSDK, &request, account)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func queryAccount(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_Account
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_Account_Query


	address := requestInfo["address"].(string)

	payload, err := sdk.Query(fabSDK, &request, address)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		acc := &sdk.Account{}
		json.Unmarshal(payload, acc)
		contex.JSON(200, gin.H{
			"data":acc,
			"msg":"succeed",
		})
	}
}

func htlcCreateMidAccount(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_CreateMidAccount

	var htlc sdk.CreateMidAccountArgs
	htlc.Sender = requestInfo["sender"].(string)
	htlc.PreImage = requestInfo["pre_image"].(string)
	htlc.Flag = requestInfo["flag"].(string)

	payload, err := sdk.CreateMidAccount(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func htlcCreate(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_Create

	var htlc sdk.CreateHTLCArgs
	htlc.Sender = requestInfo["sender"].(string)
	htlc.Receiver = requestInfo["receiver"].(string)
	htlc.Amount = requestInfo["amount"].(string)
	htlc.TTL = requestInfo["ttl"].(string)
	htlc.PreImage = requestInfo["pre_image"].(string)
	htlc.Passwd = requestInfo["passwd"].(string)
	htlc.MidAddress = requestInfo["mid_address"].(string)


	payload, err := sdk.CreateHTLC(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func htlcCreateByHash(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_CreateHash


	var htlc sdk.CreateHTLBHashArgs
	htlc.Sender = requestInfo["sender"].(string)
	htlc.Receiver = requestInfo["receiver"].(string)
	htlc.Amount = requestInfo["amount"].(string)
	htlc.TTL = requestInfo["ttl"].(string)
	htlc.Hash = requestInfo["hash"].(string)
	htlc.Passwd = requestInfo["passwd"].(string)
	htlc.MidAddress = requestInfo["mid_address"].(string)


	payload, err := sdk.CreateHTLCByHash(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func htlcWithdraw(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_Withdraw


	var htlc sdk.ReceiveHTLCArgs
	htlc.ID = requestInfo["id"].(string)
	htlc.PreImage = requestInfo["pre_image"].(string)


	payload, err := sdk.ReceiveHTLC(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func htlcRefund(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_Refund


	var htlc sdk.RefundHTLCArgs
	htlc.ID = requestInfo["id"].(string)
	htlc.PreImage = requestInfo["pre_image"].(string)

	payload, err := sdk.RefundHTLC(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		contex.JSON(200, gin.H{
			"data":string(payload),
			"msg":"succeed",
		})
	}
}

func htlcQuery(contex *gin.Context) {
	var requestInfo map[string]interface{}
	body := contex.Request.Body
	bodyBytes, _ := ioutil.ReadAll(body)
	err := json.Unmarshal(bodyBytes, &requestInfo)
	if err != nil {
		contex.JSON(101, gin.H{
			"data":nil,
			"msg":"json unmarshal error " + err.Error(),
		})
		return
	}

	var request sdk.InvokeChainCodeRequest
	request.OrgName = OrgName
	request.ChaincodeID = ChainCodeID_HTLC
	request.Peer = Peer
	request.ChannelID = ChannelID
	request.UserName = UserName
	request.Function = Func_HTLC_Query


	var htlc sdk.QueryHTLCArgs
	htlc.ID = requestInfo["id"].(string)

	payload, err := sdk.QueryHTLC(fabSDK, &request, htlc)
	if err != nil {
		contex.JSON(102, gin.H{
			"data":nil,
			"message": err.Error(),
		})
	} else {
		htlc := &sdk.HTLC{}
		err = json.Unmarshal(payload, htlc)
		contex.JSON(200, gin.H{
			"data":htlc,
			"msg":"succeed",
		})
	}
}

