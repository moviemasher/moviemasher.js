cd $SRC
curl -O -L https://downloads.sourceforge.net/project/lame/lame/${LAME_VERSION}/lame-${LAME_VERSION}.tar.gz
tar xzvf lame-${LAME_VERSION}.tar.gz
cd lame-${LAME_VERSION}
# ./configure --prefix="${PREFIX}" --bindir="${PREFIX}/bin" --enable-shared --enable-nasm --disable-frontend
./configure --prefix="${PREFIX}" --bindir="${PREFIX}/bin" --disable-shared --enable-nasm --disable-frontend
make
$SUDO make install
cd $DIR_ROOT
$SUDO rm -rf $SRC/lame-${LAME_VERSION}* 
echo "Installed Lame"
