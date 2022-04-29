#!/bin/sh
set -e ;
source dev/image/sh/options.sh ;

$SUDO rm -rf $SRC/vpx* ;
$SUDO rm -rf $SRC/lame* ;
$SUDO rm -rf $SRC/opus-$OPUS_VERSION* ;
$SUDO rm -rf $SRC/xvidcore* ;
$SUDO rm -rf $SRC/opencore-amr-$AMR_VERSION* ;
$SUDO rm -rf $SRC/x264* ;
$SUDO rm -rf $SRC/openjpeg* ;

# $SUDO yum remove -y $AV_DEPENDENCIES ;
# $SUDO yum clean all ;
# $SUDO yum autoremove -y ;
