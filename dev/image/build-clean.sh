#!/bin/sh
set -e ;
NODE_APP=$(pwd)

# cd $NODE_APP
source dev/image/sh/tools-build.sh ;
cd $NODE_APP
source dev/image/sh/avlibs-build.sh ;
cd $NODE_APP
source dev/image/sh/ffmpeg-build.sh ;
cd $NODE_APP
source dev/image/sh/node-build.sh ;
cd $NODE_APP
source dev/image/sh/python3-build.sh ;

cd $NODE_APP
npm install
npm run build

cd $NODE_APP
source dev/image/sh/python3-clean.sh ;
cd $NODE_APP
source dev/image/sh//ffmpeg-clean.sh ;
cd $NODE_APP
source dev/image/sh/avlibs-clean.sh ;
cd $NODE_APP
source dev/image/sh/tools-clean.sh ;
