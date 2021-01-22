#!/bin/bash

ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')")
VERSION=1.9.26-unstable-8d62ee65
BINARY_FILE=geth-${ARCH}-${VERSION}.tar.gz
URL=https://gethstore.blob.core.windows.net/builds/${BINARY_FILE}

download() {
    echo "===> Downloading: " "${URL}"
    curl -L --retry 5 --retry-delay 3 "${URL}" | tar xz || rc=$?
    if [ -n "$rc" ]; then
        echo "==> There was an error downloading the binary file."
        return 22
    else
        echo "==> Done."
    fi
}

enterDatadir() {
    dir=geth-${ARCH}-${VERSION}
    echo ${dir}
    cd ${dir}
}

initDatadir() {
    enterDatadir
    ./geth --datadir data0 init ../genesis.json
}

startNode() {
    enterDatadir
    ./geth --rpc --rpcport "8545" --rpccorsdomain "*" --datadir "./data0" --port "30303"  --networkid 100000 \
    --allow-insecure-unlock --etherbase 0x93ee701C44f9aa98086685c3AC5810f79762202d  \
    --mine --minerthreads=8 console
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


runHTLC() {
    #  sleep 15 seconds to allow coinbase mined some blocks and get a few ETH
    sleep 15
    npm run test
}

MODE=$1
if [ "${MODE}" == "download" ]; then
  download
  initDatadir
elif [ "${MODE}" == "start" ]; then
  startNode
elif [ "${MODE}" == "run" ]; then
  setupEnv
  runHTLC
fi
