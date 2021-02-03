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
    echo -e "\n"
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
echo -e "\n"
./launch.sh start
echo "sleep 15s to allow Miner to mine some ETH..."
sleep 15
cd ../

cd htlc-client
chmod +x runHTLC.sh
./runHTLC.sh run