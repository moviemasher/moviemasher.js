cd $SRC
git clone --branch stable --depth 2 https://bitbucket.org/multicoreware/x265_git
cd x265_git/build/linux
# ./configure --prefix=$PREFIX --bindir=$DIR_BINARY --enable-static
cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX="$PREFIX" -DENABLE_SHARED:bool=off ../../source
make
$SUDO make install

cd $DIR_ROOT
$SUDO rm -rf $SRC/x265_git* 
echo "Installed X265"
