package sdk

import (
	"fmt"
	
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
)

func invoke(fab *fabsdk.FabricSDK, request *InvokeChainCodeRequest, args [][]byte) ([]byte, error) {

	req := channel.Request{
		ChaincodeID: request.ChaincodeID,
		Fcn:         request.Function,
		Args:        args,
	}

	reqPeers := channel.WithTargetEndpoints(request.Peer)
	clientChannelContext := fab.ChannelContext(request.ChannelID, fabsdk.WithUser(request.UserName), fabsdk.WithOrg(request.OrgName))
	channelClient, err := channel.New(clientChannelContext)
	if err != nil {
		return nil, fmt.Errorf("create channel client error : %v", err)
	}

	resp, err := channelClient.Execute(req, reqPeers)
	if err != nil {
		return nil, fmt.Errorf("invoke chaincode error %v\n", err.Error())
	}

	return resp.Payload, nil
}
