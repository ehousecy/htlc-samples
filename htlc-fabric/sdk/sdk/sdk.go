package sdk

import (
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
)

func SetUpSDK(configFile string) (*fabsdk.FabricSDK, error) {
	sdk, err := fabsdk.New(config.FromFile(configFile))
	return sdk, err
}
