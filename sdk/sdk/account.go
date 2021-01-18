package sdk

import "github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"

func RegisterAccount(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, account CreateAccountArgs) ([]byte, error) {
	args := packArgs([]string{account.Address, account.PassWD, account.Flag})
	return invoke(fab, request, args)
}

func Transfer(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, transfer TransferArgs) ([]byte, error) {
	args := packArgs([]string{transfer.From, transfer.To, transfer.Amount, transfer.Passwd})
	return invoke(fab, request, args)
}

func Query(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, address string) ([]byte, error) {
	args := packArgs([]string{address})
	return invoke(fab, request, args)
}
