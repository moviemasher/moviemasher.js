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
NPM_BUILD='' ;

while getopts i:n:m:e:o:i:r:s:b:p:u: flag
do
  case "${flag}" in
    e) OS_EXECUTE=${OPTARG};;
    o) OS_INSTALL=${OPTARG};;
    i) INSTALL_NODE=${OPTARG};;
    n) NPM_INSTALL=${OPTARG};;
    m) NPM_BUILD=${OPTARG};;
    r) DIR_ROOT=${OPTARG};;
    s) SUDO='sudo';;
    b) DIR_BINARY=${OPTARG};;
    p) PREFIX=${OPTARG};;
    u) SRC=${OPTARG};;
  esac
done
ESSENTIAL_TOOL_DEPENDENCIES='pkgconfig autoconf automake' ;
TOOL_DEPENDENCIES='nasm yasm yasm-devel libtool cmake make bzip2 gcc gcc-c++ diffutils bzip2-devel tar zlib-devel git' ;

ESSENTIAL_AV_DEPENDENCIES='cairo-devel pango-devel libjpeg-turbo-devel giflib-devel librsvg2-devel librsvg2-tools librsvg2 openjpeg2 opus libvorbis-devel libtheora-devel libogg-devel' ;
AV_DEPENDENCIES='openjpeg2-devel libsndfile-devel harfbuzz-devel libjpeg-devel libwebp-devel libzstd-devel jbigkit-devel' ;
FFMPEG_ENABLE_CORE='--enable-gpl --enable-nonfree --enable-version3 --enable-postproc --enable-pthreads --enable-swresample' ;
FFMPEG_ENABLE_AV='--enable-libopenjpeg --enable-librsvg --enable-libx264 --enable-libfdk_aac --enable-libmp3lame --enable-libvpx --enable-libtheora --enable-libvorbis --enable-zlib --enable-libopus' ;

LAME_VERSION='3.100' ;
FFMPEG_VERSION='6.0.1' ;

$SUDO yum update -y ;

cd $DIR_ROOT ;

if [[ ! -z "${OS_INSTALL}" ]] ; then  
  echo "OS_INSTALL: ${OS_INSTALL}" ;
  $SUDO yum install -y $OS_INSTALL ;
fi

$SUDO yum install -y $TOOL_DEPENDENCIES $ESSENTIAL_TOOL_DEPENDENCIES ;

if [[ ! -z "${INSTALL_NODE}" ]] ; then  
  echo "INSTALL_NODE: ${INSTALL_NODE}" ;
  . dev/image/sh/makes/node.sh ;
fi

if [[ ! -z "${OS_EXECUTE}" ]] ; then  
  echo "OS_EXECUTE: ${OS_EXECUTE}" ;
  $SUDO $OS_EXECUTE ;
fi

$SUDO yum install -y $AV_DEPENDENCIES $ESSENTIAL_AV_DEPENDENCIES ;

# ffmpeg dependencies that require compilation
. dev/image/sh/makes/x264.sh ;
. dev/image/sh/makes/fdk-aac.sh ;
. dev/image/sh/makes/lame.sh ;
. dev/image/sh/makes/vpx.sh ;

# ffmpeg itself
. dev/image/sh/makes/ffmpeg.sh ;

# do an npm build if the user provides option
if [[ ! -z "${NPM_BUILD}" ]] ; then  
  echo "NPM_BUILD: ${NPM_BUILD}" ;
  $SUDO npm install --build-from-source $NPM_BUILD ;
fi

# do an npm install if the user provides option
if [[ ! -z "${NPM_INSTALL}" ]] ; then  
  echo "NPM_INSTALL: ${NPM_INSTALL}" ;
  $SUDO npm install $NPM_INSTALL ;
fi
$SUDO yum remove -y $TOOL_DEPENDENCIES $AV_DEPENDENCIES ;

$SUDO yum clean all ;
$SUDO yum autoremove -y ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* ;
$SUDO rm -r dev/image* ;
