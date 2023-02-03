#!/bin/sh
set -e ;

SUDO='' ;
DIR_BINARY='/usr/bin' ;
PREFIX='/usr' ;
SRC='/usr/local/src' ;
DIR_ROOT=$(pwd) ;
OS_INSTALL='' ;
OS_EXECUTE='' ;
NPM_INSTALL='' ;

while getopts i:n:e:o:i:r:s:b:p:u: flag
do
  case "${flag}" in
    e) OS_EXECUTE=${OPTARG};;
    o) OS_INSTALL=${OPTARG};;
    i) INSTALL_NODE=${OPTARG};;
    n) NPM_INSTALL=${OPTARG};;
    r) DIR_ROOT=${OPTARG};;
    s) SUDO='sudo';;
    b) DIR_BINARY=${OPTARG};;
    p) PREFIX=${OPTARG};;
    u) SRC=${OPTARG};;
  esac
done

TOOL_DEPENDENCIES='diffutils bzip2 cmake gcc gcc-c++ git libtool make nasm tar yasm yasm-devel' ;
AV_DEPENDENCIES='opus freetype-devel fontconfig-devel fribidi-devel libogg-devel libsndfile-devel speex-devel librsvg2-devel libtheora-devel libvorbis-devel' ;
ENABLE='--enable-librsvg --enable-libopenjpeg --enable-libfontconfig --enable-libfreetype --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libspeex --enable-libtheora --enable-libvorbis --enable-libx264 --enable-zlib --enable-libxvid --enable-libvpx --enable-libopus --enable-postproc --enable-pthreads --enable-version3 --enable-gpl --enable-swresample'

AMR_VERSION='0.1.3' ;
LAME_VERSION='3.100' ;
VPX_VERSION=1.8.0 ;
XVID_VERSION='1.3.5' ;
FFMPEG_VERSION='5.1.2' ;

$SUDO yum update -y ;

cd $DIR_ROOT 

if [[ ! -z "${OS_INSTALL}" ]] ; then  
  echo "OS_INSTALL: ${OS_INSTALL}" ;
  $SUDO yum install -y $OS_INSTALL ;
fi

$SUDO yum install -y $TOOL_DEPENDENCIES ;

if [[ ! -z "${INSTALL_NODE}" ]] ; then  
  echo "INSTALL_NODE: ${INSTALL_NODE}" ;
  . dev/image/sh/makes/node.sh ;
fi

if [[ ! -z "${OS_EXECUTE}" ]] ; then  
  echo "OS_EXECUTE: ${OS_EXECUTE}" ;
  $SUDO $OS_EXECUTE ;
fi

$SUDO yum install -y $AV_DEPENDENCIES ;

. dev/image/sh/makes/vpx.sh ;
. dev/image/sh/makes/lame.sh ;
. dev/image/sh/makes/xvid.sh ;
. dev/image/sh/makes/opencore-amr.sh ;
. dev/image/sh/makes/x264.sh ;
. dev/image/sh/makes/openjpeg.sh ;
. dev/image/sh/makes/ffmpeg.sh ;


if [[ ! -z "${NPM_INSTALL}" ]] ; then  
  echo "NPM_INSTALL: ${NPM_INSTALL}" ;
  $SUDO npm install $NPM_INSTALL ;
fi

$SUDO yum remove -y $TOOL_DEPENDENCIES ;

$SUDO yum clean all ;
# $SUDO yum autoremove -y ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* ;
$SUDO rm -r dev/image* ;

