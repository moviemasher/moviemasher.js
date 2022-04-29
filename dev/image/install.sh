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

# DEFINE TOOLS AND LIBRARIES
DEPENDENCIES='
bzip2
bzip2-devel
cmake
dpkg
fontconfig-devel
freetype-devel
frei0r-devel
fribidi-devel
gcc
gcc-c++
git
gzip
libid3tag-devel
libmad-devel
libogg-devel
libsamplerate-devel
libsndfile-devel
libtheora-devel
libtool
libvorbis-devel
make
nasm
speex-devel
tar
xz
yasm
yasm-devel
'
;

$SUDO
yum update -y ;
$SUDO amazon-linux-extras install -y epel ;
$SUDO yum install -y $DEPENDENCIES ;

cd $SRC ;
curl -sL https://rpm.nodesource.com/setup_$VERSION_NODE | $SUDO bash - ;
$SUDO yum install -y nodejs ;
$SUDO npm install -g npm@$VERSION_NPM ;

cd $SRC ;
yasm --version ;
git clone --depth 1 https://chromium.googlesource.com/webm/libvpx.git ;
cd libvpx ;
./configure --prefix=$PREFIX --disable-examples --disable-unit-tests --enable-vp9-highbitdepth --as=yasm ;
make ;
$SUDO make install ;

cd $SRC ;
curl --silent -O -L https://downloads.sourceforge.net/project/lame/lame/$VERSION_LAME/lame-$VERSION_LAME.tar.gz ;
tar -xzf lame-$VERSION_LAME.tar.gz ;
cd lame-$VERSION_LAME ;
./configure --prefix=$PREFIX --bindir=$DIR_BINARY --disable-shared --enable-yasm ;
make ;
$SUDO make install ;

cd $SRC ;
curl --silent -O -L https://archive.mozilla.org/pub/opus/opus-$VERSION_OPUS.tar.gz ;
tar -xzf opus-$VERSION_OPUS.tar.gz ;
cd opus-$VERSION_OPUS ;
./configure --prefix=$PREFIX --disable-shared ;
make ;
$SUDO make install ;

cd $SRC ;
curl --silent -O -L http://downloads.xvid.org/downloads/xvidcore-$VERSION_XVID.tar.gz ;
tar -zxf xvidcore-$VERSION_XVID.tar.gz ;
cd xvidcore/build/generic ;
./configure --prefix=$PREFIX ;
make ;
$SUDO make install ;

cd $SRC ;
curl --silent -O -L http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-$VERSION_AMR.tar.gz ;
tar -xf opencore-amr-$VERSION_AMR.tar.gz ;
cd opencore-amr-$VERSION_AMR ;
./configure --prefix=$PREFIX --disable-shared ;
make ;
$SUDO make install ;

cd $SRC ;
git clone --depth 1 https://code.videolan.org/videolan/x264.git ;
cd x264 ;
./configure --prefix=$PREFIX --bindir=$DIR_BINARY --enable-static ;
make ;
$SUDO make install ;
whereis x264 ;

cd $SRC ;
git clone https://github.com/uclouvain/openjpeg.git ;
mkdir openjpeg/build ;
cd openjpeg/build ;
cmake .. -DCMAKE_INSTALL_PREFIX=$PREFIX -DCMAKE_BUILD_TYPE=Release ;
make ;
$SUDO make install ;
$SUDO ldconfig ;

cd $SRC ;
curl --silent -O -L https://ffmpeg.org/releases/ffmpeg-$VERSION_FFMPEG.tar.gz ;
tar -xzf ffmpeg-$VERSION_FFMPEG.tar.gz ;
cd ffmpeg-$VERSION_FFMPEG ;
PATH="$DIR_BINARY:$PATH" PKG_CONFIG_PATH=$PREFIX/lib/pkgconfig ./configure --prefix=$PREFIX --pkg-config-flags="--static" --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm --bindir=$DIR_BINARY --enable-libopenjpeg --enable-frei0r --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libspeex --enable-libtheora --enable-libvorbis --enable-libx264 --enable-zlib --enable-libxvid --enable-libvpx --enable-libopus --enable-postproc --enable-pthreads --enable-version3 --enable-gpl ;
make ;
$SUDO make install ;
whereis ffmpeg ;


$SUDO yum clean all ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* $SRC/* ;
