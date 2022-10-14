#!/bin/sh
set -e ;
source dev/image/sh/ffmpeg/options.sh ;

$SUDO rm -rf $SRC/ffmpeg-$VERSION_FFMPEG* ;
