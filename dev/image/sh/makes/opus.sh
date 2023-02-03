cd $SRC
curl --silent -O -L https://archive.mozilla.org/pub/opus/opus-$OPUS_VERSION.tar.gz
tar -xzf opus-$OPUS_VERSION.tar.gz
cd opus-$OPUS_VERSION
./configure --prefix=$PREFIX --disable-shared
make
$SUDO make install

cd $DIR_ROOT
$SUDO rm -rf $SRC/opus-$OPUS_VERSION* ;
echo "Installed Opus"