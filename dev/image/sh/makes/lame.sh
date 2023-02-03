cd $SRC
$SUDO mkdir lame
cd lame
curl -sL https://sourceforge.net/projects/lame/files/lame/${LAME_VERSION}/lame-${LAME_VERSION}.tar.gz/download | tar -zx --strip-components=1
./configure --prefix="${PREFIX}" --bindir="${PREFIX}/bin" --enable-shared --enable-nasm --disable-frontend
make
$SUDO make install


cd $DIR_ROOT
$SUDO rm -rf $SRC/lame* 
echo "Installed Lame"