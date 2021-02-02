#!/bin/bash

make build
echo "--------------------Start Fabric Sdk Service--------------------"
nohup ./fabricsdk 2>&1 &
