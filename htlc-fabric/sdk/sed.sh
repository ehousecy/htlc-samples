#!/bin/bash

ARCH=$(uname -s | grep Darwin)
NEWSTR=`echo ${PWD//\//\\\/}`
OLDSTR='s/${PWD}/'
if [ "$ARCH" == "Darwin" ]; then
  sed -i "" $OLDSTR$NEWSTR/g config.yaml
else
  sed -i $OLDSTR$NEWSTR/g config.yaml
fi