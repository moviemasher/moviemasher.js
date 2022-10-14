#!/bin/sh
set -e ;
NODE_APP=$(pwd)

source dev/image/sh/tools/build.sh ;
cd $NODE_APP ;
source dev/image/sh/avlibs/build.sh ;
cd $NODE_APP ;
source dev/image/sh/ffmpeg/build.sh ;
cd $NODE_APP ;
source dev/image/sh/node/build.sh ;

cd $NODE_APP ;
npm install -w @moviemasher/server-express ;

cd $NODE_APP ;
source dev/image/sh/node/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/ffmpeg/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/avlibs/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/tools/clean.sh ;
