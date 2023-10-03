cd $SRC 
$SUDO /sbin/ldconfig $PREFIX/lib

curl -O -L https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 
tar xjvf ffmpeg-snapshot.tar.bz2 
cd ffmpeg

PATH="$DIR_BINARY:$PATH" LD_LIBRARY_PATH="$PREFIX/lib:$PREFIX/lib64" PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig:$PREFIX/lib64/pkgconfig" ./configure --prefix=$PREFIX --bindir=$DIR_BINARY --disable-debug --disable-doc --disable-ffplay --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm --pkg-config-flags="--static" $ENABLE 
make 
$SUDO make install 
whereis ffmpeg 
ffmpeg -version 

make tools/graph2dot
mv tools/graph2dot /usr/bin/

cd $DIR_ROOT 
$SUDO rm -rf $SRC/ffmpeg* 
echo "Installed FFmpeg"
