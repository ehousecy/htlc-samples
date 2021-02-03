#!/bin/bash

ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')")
VERSION=1.8.20-24d727b6
BINARY_FILE=geth-${ARCH}-${VERSION}.tar.gz
URL=https://gethstore.blob.core.windows.net/builds/${BINARY_FILE}

download() {
    echo "===> Downloading: " "${URL}"
    curl -L --retry 5 --retry-delay 3 "${URL}" | tar xz || rc=$?
    if [ -n "$rc" ]; then
        echo "==> There was an error downloading the binary file."
        return 22
    else
        mv geth-${ARCH}-${VERSION} geth1.8
        echo "==> Done."
    fi
}

enterDatadir() {
    dir=geth1.8
    cd ${dir}
}

initDatadir() {
    enterDatadir
    ./geth --datadir data0 init ../genesis.json
}

startNode() {
    enterDatadir
    echo "--------------------Start ETH Node--------------------"
    chmod +x geth
    nohup ./geth --rpc --rpcport "8545" --rpccorsdomain "*" --datadir "./data0" --port "30303"  --networkid 100000 \
    --etherbase 0x03D08CC857191E53d87fD70981c48f36844e160c  \
    --mine --minerthreads=8 2>&1 &
}

# this is requried on your first try
setupEnv() {
    node_modulesPath="node_modules"
    if [ ! -d "$node_modulesPath" ]; then
        npm install
    fi

    tsconfig_path="tsconfig.json"
    if [ ! -f "$tsconfig_path" ]; then
        npm run inittsc
    fi
}



MODE=$1
if [ "${MODE}" == "download" ]; then
  download
  initDatadir
elif [ "${MODE}" == "start" ]; then
  startNode
  setupEnv
fi

