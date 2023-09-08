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


TOOL_DEPENDENCIES='nasm yasm yasm-devel libtool automake cmake make bzip2 autoconf gcc gcc-c++ diffutils bzip2-devel tar zlib-devel freetype-devel git pkgconfig' ;
AV_DEPENDENCIES='libjpeg-devel libwebp-devel libzstd-devel jbigkit-devel openjpeg2 openjpeg2-devel opus fontconfig-devel fribidi-devel libogg-devel libsndfile-devel speex-devel librsvg2 librsvg2-devel librsvg2-tools libtheora-devel libvorbis-devel' ;
ENABLE='--enable-gpl --enable-nonfree --enable-version3 --enable-libopenjpeg --enable-librsvg --enable-libx264 --enable-libfdk_aac --enable-libmp3lame --enable-libvpx --enable-libfontconfig --enable-libfreetype --enable-libspeex --enable-libtheora --enable-libvorbis  --enable-zlib --enable-libopus --enable-postproc --enable-pthreads --enable-swresample'
# -

# --enable-libxvid --enable-libx265 --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libx265

# OPUS_VERSION='1.3.1' 
# AMR_VERSION='0.1.3' ;
LAME_VERSION='3.100' ;
# XVID_VERSION='1.3.5' ;
FFMPEG_VERSION='6.0' ;

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

# # FFmpeg expects to find librsvg rather than librsvg-2.0, as AL3 installs it.
# $SUDO ln -s /usr/include/librsvg-2.0 /usr/include/librsvg
# $SUDO ln -s /usr/lib64/pkgconfig/librsvg-2.0.pc /usr/lib64/pkgconfig/librsvg.pc 

# $SUDO /sbin/ldconfig $PREFIX/lib64

. dev/image/sh/makes/x264.sh ;
. dev/image/sh/makes/fdk-aac.sh ;
. dev/image/sh/makes/lame.sh ;
. dev/image/sh/makes/vpx.sh ;


# . dev/image/sh/makes/opus.sh ;
# . dev/image/sh/makes/xvid.sh ;
# . dev/image/sh/makes/openjpeg.sh ;
# . dev/image/sh/makes/opencore-amr.sh ;
# . dev/image/sh/makes/x265.sh ;
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

