#!/bin/sh
set -e ;
source dev/image/sh/node/options.sh ;

cd $SRC ;
curl -sL https://rpm.nodesource.com/setup_$NODE_VERSION | $SUDO bash - ;
$SUDO yum install -y nodejs ;
$SUDO npm install -g npm@$NPM_VERSION ;
