#!/bin/sh
set -e ;

# DEFINE ARGUMENT DEFAULTS
SUDO=''
DIR_BINARY='/usr/bin' ;
DIR_BUILD='/usr' ;
DIR_SOURCE='/root' ;

while getopts s:n:b:u: flag
do
  case "${flag}" in
    s) SUDO='sudo';;
    n) DIR_BINARY=${OPTARG};;
    b) DIR_BUILD=${OPTARG};;
    u) DIR_SOURCE=${OPTARG};;
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
DEPENDENCIES='git dpkg tar gzip xz gcc cmake make gcc-c++ libtool bzip2 bzip2-devel yasm yasm-devel nasm freetype-devel fontconfig-devel fribidi-devel frei0r-devel libogg-devel libsamplerate-devel libsndfile-devel speex-devel libtheora-devel libvorbis-devel libmad-devel libid3tag-devel' ;

$SUDO yum update -y ;
$SUDO amazon-linux-extras install -y epel ;
$SUDO yum install -y $DEPENDENCIES ;

cd $DIR_SOURCE ;
curl -sL https://rpm.nodesource.com/setup_$VERSION_NODE | $SUDO bash - ;
$SUDO yum install -y nodejs ;
$SUDO npm install -g npm@$VERSION_NPM ;

cd $DIR_SOURCE ;
yasm --version ;
git clone --depth 1 https://chromium.googlesource.com/webm/libvpx.git ;
cd libvpx ;
./configure --prefix=$DIR_BUILD --disable-examples --disable-unit-tests --enable-vp9-highbitdepth --as=yasm ;
make ;
$SUDO make install ;

cd $DIR_SOURCE ;
curl --silent -O -L https://downloads.sourceforge.net/project/lame/lame/$VERSION_LAME/lame-$VERSION_LAME.tar.gz ;
tar -xzf lame-$VERSION_LAME.tar.gz ;
cd lame-$VERSION_LAME ;
./configure --prefix=$DIR_BUILD --bindir=$DIR_BINARY --disable-shared --enable-yasm ;
make ;
$SUDO make install ;

cd $DIR_SOURCE ;
curl --silent -O -L https://archive.mozilla.org/pub/opus/opus-$VERSION_OPUS.tar.gz ;
tar -xzf opus-$VERSION_OPUS.tar.gz ;
cd opus-$VERSION_OPUS ;
./configure --prefix=$DIR_BUILD --disable-shared ;
make ;
$SUDO make install ;

cd $DIR_SOURCE ;
curl --silent -O -L http://downloads.xvid.org/downloads/xvidcore-$VERSION_XVID.tar.gz ;
tar -zxf xvidcore-$VERSION_XVID.tar.gz ;
cd xvidcore/build/generic ;
./configure --prefix=$DIR_BUILD ;
make ;
$SUDO make install ;

cd $DIR_SOURCE ;
curl --silent -O -L http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-$VERSION_AMR.tar.gz ;
tar -xf opencore-amr-$VERSION_AMR.tar.gz ;
cd opencore-amr-$VERSION_AMR ;
./configure --prefix=$DIR_BUILD --disable-shared ;
make ;
$SUDO make install ;

cd $DIR_SOURCE ;
git clone --depth 1 https://code.videolan.org/videolan/x264.git ;
cd x264 ;
./configure --prefix=$DIR_BUILD --bindir=$DIR_BINARY --enable-static ;
make ;
$SUDO make install ;
whereis x264 ;

cd $DIR_SOURCE ;
git clone https://github.com/uclouvain/openjpeg.git ;
mkdir openjpeg/build ;
cd openjpeg/build ;
cmake .. -DCMAKE_INSTALL_PREFIX=$DIR_BUILD -DCMAKE_BUILD_TYPE=Release ;
make ;
$SUDO make install ;
$SUDO ldconfig ;

cd $DIR_SOURCE ;
curl --silent -O -L https://ffmpeg.org/releases/ffmpeg-$VERSION_FFMPEG.tar.gz ;
tar -xzf ffmpeg-$VERSION_FFMPEG.tar.gz ;
cd ffmpeg-$VERSION_FFMPEG ;
PATH="$DIR_BINARY:$PATH" PKG_CONFIG_PATH=$DIR_BUILD/lib/pkgconfig ./configure --prefix=$DIR_BUILD --pkg-config-flags="--static" --extra-cflags="-I$DIR_BUILD/include" --extra-ldflags="-L$DIR_BUILD/lib" --extra-libs=-lpthread --extra-libs=-lm --bindir=$DIR_BINARY --enable-libopenjpeg --enable-frei0r --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libspeex --enable-libtheora --enable-libvorbis --enable-libx264 --enable-zlib --enable-libxvid --enable-libvpx --enable-libopus --enable-postproc --enable-pthreads --enable-version3 --enable-gpl ;
make ;
$SUDO make install ;
whereis ffmpeg ;


$SUDO yum clean all ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* $DIR_SOURCE/* ;
