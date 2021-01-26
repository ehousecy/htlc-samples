#!/bin/bash

ARCH=$(uname -s | grep Darwin)
if [ $ARCH == "Darwin" ]; then
  NEWSTR=`echo ${GOPATH//\//\\\/}`
  OLDSTR='s/${GOPATH}/'
  sed -i "" $OLDSTR$NEWSTR/g config.yaml
else
  NEWSTR=`echo ${GOPATH//\//\\\/}`
  OLDSTR='s/${GOPATH}/'
  sed -i $OLDSTR$NEWSTR/g config.yaml
fi