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
VERSION_ZMQJS=5 #'6.0.0-beta.6' #'5.2.8' #

yum install -y libzmq-dev
echo "find libzmq files in $PREFIX"
find $PREFIX -name '*libzmq*' ; # /usr/lib/pkgconfig/libzmq.pc

# echo "find mq files in $SRC"
# find $SRC -name '*mq*' ; # /usr/lib/pkgconfig/libzmq.pc


# echo 'whereis libzmq'
# whereis libzmq ; # zmq: /usr/include/zmq.h

# echo 'pkg-config --modversion libzmq'
# pkg-config --modversion libzmq
# exit 1;


# cd $SRC ;

# export PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig"
# ls -al $PREFIX/lib/pkgconfig
# pkg-config --modversion libzmq
# exit 1;

# $SUDO ldconfig
# whereis zmq  # zmq: /usr/include/zmq.h
# find $PREFIX -name libzmq.pc  # /usr/lib/pkgconfig/libzmq.pc


# export npm_config_zmq_external="true"
$SUDO npm install -g zeromq@$VERSION_ZMQJS --zmq-external--zmq-shared
#
