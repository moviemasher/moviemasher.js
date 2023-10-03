cd $SRC
curl -O -L https://github.com/libass/libass/archive/${LIBASS_VERSION}.tar.gz 
tar xzvf ${LIBASS_VERSION}.tar.gz 

cd libass-${LIBASS_VERSION}

./autogen.sh 
./configure -prefix="${PREFIX}" --bindir="${PREFIX}/bin" --disable-static --enable-shared 
make 

$SUDO make install
cd $DIR_ROOT
$SUDO rm -rf $SRC/libass* 
echo "Installed libass"
