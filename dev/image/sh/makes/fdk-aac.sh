cd $SRC
git clone --depth 1 https://github.com/mstorsjo/fdk-aac
cd fdk-aac
autoreconf -fiv
./configure --prefix=$PREFIX --disable-shared
make
$SUDO make install

cd $DIR_ROOT
$SUDO rm -rf $SRC/fdk-aac* 
echo "Installed fdk-aac"

