cd $SRC 
$SUDO /sbin/ldconfig $PREFIX/lib
curl --silent -O -L https://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.gz 
tar -xzf ffmpeg-$FFMPEG_VERSION.tar.gz 
cd ffmpeg-$FFMPEG_VERSION 

use sed to replace 'rsvg_handle_render_cairo' with 'rsvg_handle_render_document' in confgure file.
sed -i 's/rsvg_handle_render_cairo/rsvg_handle_render_document/g' configure

sed -i 's/rsvg_handle_render_cairo(handle, crender)/RsvgRectangle viewport;\nviewport.x=0;\nviewport.y=0;\nviewport.width=dimensions.width;\nviewport.height=dimensions.height;\nrsvg_handle_render_document(handle, crender, \&viewport)/g' libavcodec/librsvgdec.c

PATH="$DIR_BINARY:$PATH" LD_LIBRARY_PATH="$PREFIX/lib:$PREFIX/lib64" PKG_CONFIG_PATH="$PREFIX/lib/pkgconfig:$PREFIX/lib64/pkgconfig" ./configure --prefix=$PREFIX --bindir=$DIR_BINARY --disable-debug --disable-doc --disable-ffplay --extra-cflags="-I$PREFIX/include" --extra-ldflags="-L$PREFIX/lib" --extra-libs=-lpthread --extra-libs=-lm --pkg-config-flags="--static" $ENABLE 

make 
$SUDO make install 
whereis ffmpeg 
ffmpeg -version 

cd $DIR_ROOT 
$SUDO rm -rf $SRC/ffmpeg-$VERSION_FFMPEG* 
echo "Installed FFmpeg"
