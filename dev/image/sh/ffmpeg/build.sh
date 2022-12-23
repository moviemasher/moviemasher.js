#!/bin/sh
set -e ;
source dev/image/sh/ffmpeg/options.sh ;

ENABLE='--enable-librsvg --enable-libopenjpeg --enable-frei0r --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libspeex --enable-libtheora --enable-libvorbis --enable-libx264 --enable-zlib --enable-libxvid --enable-libvpx --enable-libopus --enable-postproc --enable-pthreads --enable-version3 --enable-gpl --enable-swresample'
$SUDO /sbin/ldconfig $PREFIX/lib ;

cd $SRC ;
curl --silent -O -L https://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.gz ;
tar -xzf ffmpeg-$FFMPEG_VERSION.tar.gz ;
cd ffmpeg-$FFMPEG_VERSION ;

# --pkg-config-flags="--static"
PATH="$DIR_BINARY:$PATH" LD_LIBRARY_PATH="$PREFIX/lib:$PREFIX/lib64" PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig:$PREFIX/lib64/pkgconfig" ./configure --disable-debug --disable-doc --disable-ffplay --prefix=$PREFIX --bindir=$DIR_BINARY --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm $ENABLE ;

make ;
$SUDO make install ;
whereis ffmpeg ;
ffmpeg -version ;
