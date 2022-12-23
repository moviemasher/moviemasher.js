#!/bin/sh
set -e ;
NODE_APP=$(pwd)

cd $NODE_APP ;
source dev/image/sh/build.sh ;

cd $NODE_APP ;
npm install ;

cd $NODE_APP ;
source dev/image/sh/clean.sh ;
