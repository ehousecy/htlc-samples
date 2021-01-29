#!/bin/bash


enterDatadir() {
    dir=geth-${ARCH}-${VERSION}
    echo ${dir}
    cd ${dir}
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
if [ "${MODE}" == "run" ]; then
  setupEnv
  runHTLC
fi
