cd $SRC 
$SUDO /sbin/ldconfig $PREFIX/lib
curl --silent -O -L https://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.gz 
tar -xzf ffmpeg-$FFMPEG_VERSION.tar.gz 
cd ffmpeg-$FFMPEG_VERSION 
# --pkg-config-flags="--static" 
PATH="$DIR_BINARY:$PATH" LD_LIBRARY_PATH="$PREFIX/lib:$PREFIX/lib64" PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig:$PREFIX/lib64/pkgconfig" ./configure --disable-debug --disable-doc --disable-ffplay --prefix=$PREFIX --bindir=$DIR_BINARY --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm $ENABLE 

make 
$SUDO make install 
whereis ffmpeg 
ffmpeg -version 

cd $DIR_ROOT 
$SUDO rm -rf $SRC/ffmpeg-$VERSION_FFMPEG* 
echo "Installed FFmpeg"