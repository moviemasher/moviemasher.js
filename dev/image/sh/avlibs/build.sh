#!/bin/sh
set -e
source dev/image/sh/avlibs/options.sh

$SUDO yum install -y $AV_DEPENDENCIES

cd $SRC
$SUDO mkdir vpx
cd vpx

whereis yasm

$SUDO yum install -y yasm yasm-devel
whereis yasm
curl -sL https://codeload.github.com/webmproject/libvpx/tar.gz/v${VPX_VERSION} | tar -zx --strip-components=1
./configure --prefix="${PREFIX}" --as=yasm --enable-vp8 --enable-vp9 --enable-vp9-highbitdepth --enable-pic --enable-shared --disable-debug --disable-examples --disable-docs --disable-install-bins --disable-unit-tests
make
$SUDO make install

cd $SRC
$SUDO mkdir lame
cd lame
curl -sL https://sourceforge.net/projects/lame/files/lame/${LAME_VERSION}/lame-${LAME_VERSION}.tar.gz/download | tar -zx --strip-components=1
./configure --prefix="${PREFIX}" --bindir="${PREFIX}/bin" --enable-shared --enable-nasm --disable-frontend
make
$SUDO make install

cd $SRC
curl --silent -O -L https://archive.mozilla.org/pub/opus/opus-$OPUS_VERSION.tar.gz
tar -xzf opus-$OPUS_VERSION.tar.gz
cd opus-$OPUS_VERSION
./configure --prefix=$PREFIX --disable-shared
make
$SUDO make install

cd $SRC
curl --silent -O -L http://downloads.xvid.org/downloads/xvidcore-$XVID_VERSION.tar.gz
tar -zxf xvidcore-$XVID_VERSION.tar.gz
cd xvidcore/build/generic
./configure --prefix=$PREFIX
make
$SUDO make install

cd $SRC
curl --silent -O -L http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-$AMR_VERSION.tar.gz
tar -xf opencore-amr-$AMR_VERSION.tar.gz
cd opencore-amr-$AMR_VERSION
./configure --prefix=$PREFIX --disable-shared
make
$SUDO make install

cd $SRC
git clone --depth 1 https://code.videolan.org/videolan/x264.git
cd x264
./configure --prefix=$PREFIX --bindir=$DIR_BINARY --enable-static
make
$SUDO make install
whereis x264

cd $SRC
git clone https://github.com/uclouvain/openjpeg.git
$SUDO mkdir openjpeg/build
cd openjpeg/build
cmake .. -DCMAKE_INSTALL_PREFIX=$PREFIX -DCMAKE_BUILD_TYPE=Release
make
$SUDO make install
