#!/bin/bash

ARCH=$(uname -s | grep Darwin)
NEWSTR=`echo ${PWD//\//\\\/}`
echo NEWSTR
OLDSTR='s/${PWD}/'
echo OLDSTR
if [ "$ARCH" == "Darwin" ]; then
  sed -i "" $OLDSTR$NEWSTR/g config.yaml
else
  sed -i $OLDSTR$NEWSTR/g config.yaml
fi