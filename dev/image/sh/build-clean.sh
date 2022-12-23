#!/bin/sh
set -e ;
NODE_APP=$(pwd)

source dev/image/sh/build.sh ;
cd $NODE_APP ;

cd $NODE_APP ;
source dev/image/sh/node/build.sh ;

cd $NODE_APP ;
npm install -w @moviemasher/server-express ;

cd $NODE_APP ;
source dev/image/sh/node/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/clean.sh ;
