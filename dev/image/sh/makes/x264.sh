cd $SRC
git clone --depth 1 https://code.videolan.org/videolan/x264.git
cd x264
./configure --prefix=$PREFIX --bindir=$DIR_BINARY --enable-static
make
$SUDO make install


cd $DIR_ROOT
$SUDO rm -rf $SRC/x264* 
echo "Installed X264"