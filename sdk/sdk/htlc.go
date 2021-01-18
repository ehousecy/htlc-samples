package sdk

import "github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"

func CreateMidAccount(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc CreateMidAccountArgs) ([]byte, error) {
	args := packArgs([]string{htlc.Sender, htlc.PreImage, htlc.Flag})
	return invoke(fab, request, args)
}

func CreateHTLC(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc CreateHTLCArgs) ([]byte, error) {
	args := packArgs([]string{htlc.Sender, htlc.Receiver, htlc.Amount, htlc.TTL, htlc.PreImage, htlc.Passwd, htlc.MidAddress})
	return invoke(fab, request, args)
}

func CreateHTLCByHash(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc CreateHTLBHashArgs) ([]byte, error) {
	args := packArgs([]string{htlc.Sender, htlc.Receiver, htlc.Amount, htlc.TTL, htlc.Hash, htlc.Passwd, htlc.MidAddress})
	return invoke(fab, request, args)
}

func ReceiveHTLC(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc ReceiveHTLCArgs) ([]byte, error) {
	args := packArgs([]string{htlc.ID, htlc.PreImage})
	return invoke(fab, request, args)
}

func RefundHTLC(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc RefundHTLCArgs) ([]byte, error) {
	args := packArgs([]string{htlc.ID, htlc.PreImage})
	return invoke(fab, request, args)
}

func QueryHTLC(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, htlc QueryHTLCArgs) ([]byte, error) {
	args := packArgs([]string{htlc.ID})
	return invoke(fab, request, args)
}
