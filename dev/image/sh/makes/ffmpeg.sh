cd $SRC 
$SUDO /sbin/ldconfig $PREFIX/lib
$SUDO /sbin/ldconfig $PREFIX/lib64

curl -O -L https://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.bz2 
tar xjvf ffmpeg-${FFMPEG_VERSION}.tar.bz2 
cd ffmpeg-${FFMPEG_VERSION}

# Patch for librsvgdec.c
$SUDO cp /app/dev/image/sh/patches/librsvgdec.c ./libavcodec/librsvgdec.c

PATH="$DIR_BINARY:$PATH" LD_LIBRARY_PATH="$PREFIX/lib:$PREFIX/lib64" PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig:$PREFIX/lib64/pkgconfig" ./configure --prefix=$PREFIX --bindir=$DIR_BINARY --disable-debug --disable-doc --disable-ffplay --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm --pkg-config-flags="--static" $FFMPEG_ENABLE_CORE $FFMPEG_ENABLE_AV 
make 
$SUDO make install 
whereis ffmpeg 
ffmpeg -version 

cd $DIR_ROOT 
$SUDO rm -rf $SRC/ffmpeg* 
echo "Installed FFmpeg"
