#!/bin/sh
set -e ;

SUDO='' ;
DIR_BINARY='/usr/bin' ;
PREFIX='/usr' ;
SRC='/usr/local' ;

while getopts s:n:b:u: flag
do
  case "${flag}" in
    s) SUDO='sudo';;
    n) DIR_BINARY=${OPTARG};;
    b) PREFIX=${OPTARG};;
    u) SRC=${OPTARG};;
  esac
done

# DEFINE TOOLS
TOOL_DEPENDENCIES='bzip2 cmake gcc gcc-c++ git libtool make nasm dpkg tar yasm yasm-devel' ;

# DEFINE LIBRARIES
AV_DEPENDENCIES='freetype-devel fontconfig-devel fribidi-devel frei0r-devel libogg-devel libsamplerate-devel libsndfile-devel speex-devel libtheora-devel libvorbis-devel libmad-devel libid3tag-devel' ;

# DEFINE VERSIONS
AMR_VERSION='0.1.3' ;
FFMPEG_VERSION='4.4.1' ;
LAME_VERSION='3.100' ;
OPUS_VERSION='1.3.1' ;
XVID_VERSION='1.3.5' ;
VPX_VERSION=1.8.0 ;

VERSION_NODE='16.x' ;
VERSION_NPM='8.6.0' ;

PYTHON_VERSION='3.8' ;

NODE_VERSION='16.x' ;
NPM_VERSION='8.6.0' ;
