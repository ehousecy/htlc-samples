#!/bin/bash
NEWSTR=`echo ${GOPATH//\//\\\/}`
OLDSTR='s/${GOPATH}/'
sed -i $OLDSTR$NEWSTR/g config.yaml