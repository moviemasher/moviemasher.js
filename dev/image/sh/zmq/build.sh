#!/bin/sh
set -e ;
source dev/image/sh/zmq/options.sh

cd $SRC

curl -sLO https://github.com/zeromq/libzmq/archive/v${LIBZMQ_VERSION}.tar.gz
echo ${LIBZMQ_SHA256SUM} | sha256sum --check
tar -xz --strip-components=1 -f v${LIBZMQ_VERSION}.tar.gz
./autogen.sh
./configure --prefix="${PREFIX}"
make
# make check
$SUDO make install

$SUDO yum install -y libunwind-devel ;
$SUDO /sbin/ldconfig $PREFIX/lib ;
$SUDO whereis libunwind ;


yum install -y libzmq-dev

$SUDO npm install -g zeromq@$VERSION_ZMQJS --zmq-external--zmq-shared
