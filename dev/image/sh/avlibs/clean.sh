#!/bin/sh
set -e ;
source dev/image/sh/avlibs/options.sh ;

$SUDO rm -rf $SRC/opencore-amr-$AMR_VERSION* ;
$SUDO rm -rf $SRC/lame* ;
$SUDO rm -rf $SRC/opus-$OPUS_VERSION* ;
$SUDO rm -rf $SRC/vpx* ;
$SUDO rm -rf $SRC/xvidcore* ;

$SUDO rm -rf $SRC/openjpeg* ;
$SUDO rm -rf $SRC/x264* ;
