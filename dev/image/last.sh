#!/bin/sh
set -e ;

# DEFINE ARGUMENT DEFAULTS
SUDO=''
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

# DEFINE VERSIONS
VERSION_AMR='0.1.3' ;
VERSION_FFMPEG='4.4.1' ;
VERSION_LAME='3.100' ;
VERSION_OPUS='1.3.1' ;
VERSION_XVID='1.3.5' ;
VERSION_NODE='16.x' ;
VERSION_NPM='8.6.0' ;




export PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig"


ldd ${PREFIX}/bin/ffmpeg | grep opt/ffmpeg | cut -d ' ' -f 3 | xargs -i cp {} /usr/local/lib/
for lib in /usr/local/lib/*.so.*; do ln -s "${lib##*/}" "${lib%%.so.*}".so; done
cp ${PREFIX}/bin/* /usr/local/bin/
cp -r ${PREFIX}/share/ffmpeg /usr/local/share/
LD_LIBRARY_PATH=/usr/local/lib ffmpeg -buildconf
mkdir -p /usr/local/include
cp -r ${PREFIX}/include/libav* ${PREFIX}/include/libpostproc ${PREFIX}/include/libsw* /usr/local/include
mkdir -p /usr/local/lib/pkgconfig
for pc in ${PREFIX}/lib/pkgconfig/libav*.pc ${PREFIX}/lib/pkgconfig/libpostproc.pc ${PREFIX}/lib/pkgconfig/libsw*.pc; do \
  sed "s:${PREFIX}:/usr/local:g" <"$pc" >/usr/local/lib/pkgconfig/"${pc##*/}"; \
done
