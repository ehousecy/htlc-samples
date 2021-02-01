#!/bin/bash
LaunchFabric="true"
DownloadGeth="true"

# -f: pull Fabric images and start Fabric docker containers 
# -d: download Ethereum geth
while getopts "f:d:" opt; do
  case "$opt" in
  f)
    LaunchFabric=$OPTARG
    ;;
  d)
    DownloadGeth=$OPTARG
    ;;
  esac
done

# launch fabric environment
cd htlc-fabric/deploy
if [ "${LaunchFabric}" = "true" ]; then
    chmod +x byfn.sh
    ./byfn.sh up
fi
cd ../sdk
chmod +x launch.sh
./launch.sh
cd ../../

# launch eth environment
cd htlc-eth
chmod +x launch.sh
if [ "${DownloadGeth}" = "true" ]; then
    ./launch.sh download
fi
./launch.sh start
sleep 15
./launch.sh feeTransfer
cd ../

# cd htlc-client
# chmod +x runHTLC.sh
# ./runHTLC.sh run



    # nohup ./geth --rpc --rpcport "8545" --rpccorsdomain "*" --datadir "./data0" --port "30303"  --networkid 100000 --allow-insecure-unlock --etherbase 0x93ee701C44f9aa98086685c3AC5810f79762202d  --mine --minerthreads=8 console 2>&1 &
