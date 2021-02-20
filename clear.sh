#!/bin/bash

# stop fabric sdk
SDKPID=`ps -ef | grep fabricsdk | grep -v grep | awk '{print $2}'`
kill -9 $SDKPID

# stop and remove fabric node
cd htlc-fabric/deploy
./byfn.sh down
docker ps -a | grep htlc | awk '{print $1}' | xargs docker rm
docker ps -a | grep account | awk '{print $1}' | xargs docker rm
docker images | grep htlc | awk '{print $3}' | xargs docker rmi
docker images | grep account | awk '{print $3}' | xargs docker rmi

# stop ethereum geth node service
cd ../../
GETHPID=`ps -ef | grep geth | grep -v grep | awk '{print $2}'`
kill -9 $GETHPID
rm -rf htlc-eth/geth1.8