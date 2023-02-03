cd $SRC
curl --silent -O -L http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-$AMR_VERSION.tar.gz
tar -xf opencore-amr-$AMR_VERSION.tar.gz
cd opencore-amr-$AMR_VERSION
./configure --prefix=$PREFIX --disable-shared
make
$SUDO make install


cd $DIR_ROOT
$SUDO rm -rf $SRC/opencore-amr-$AMR_VERSION* 
echo "Installed OpenCore AMR"

