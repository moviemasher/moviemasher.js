#!/bin/sh
set -e ;

cd $NODE_APP ;
source dev/image/sh/ffmpeg/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/avlibs/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/tools/clean.sh ;

cd $NODE_APP ;
source dev/image/sh/aws/clean.sh ;
