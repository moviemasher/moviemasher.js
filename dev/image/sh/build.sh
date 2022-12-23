#!/bin/sh
set -e ;

cd $NODE_APP ;
source dev/image/sh/aws/build.sh ;

cd $NODE_APP ;
source dev/image/sh/tools/build.sh ;

cd $NODE_APP ;
source dev/image/sh/avlibs/build.sh ;

cd $NODE_APP ;
source dev/image/sh/ffmpeg/build.sh ;