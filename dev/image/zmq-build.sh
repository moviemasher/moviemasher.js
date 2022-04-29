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
LIBZMQ_VERSION='4.3.2' # first supported by ffmpeg
LIBZMQ_SHA256SUM="02ecc88466ae38cf2c8d79f09cfd2675ba299a439680b64ade733e26a349edeb v4.3.2.tar.gz"

cd $SRC

curl -sLO https://github.com/zeromq/libzmq/archive/v${LIBZMQ_VERSION}.tar.gz
echo ${LIBZMQ_SHA256SUM} | sha256sum --check
tar -xz --strip-components=1 -f v${LIBZMQ_VERSION}.tar.gz
./autogen.sh
./configure --prefix="${PREFIX}"
make
# make check
$SUDO make install
