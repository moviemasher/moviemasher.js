cd $SRC 
curl --silent -O -L http://downloads.xvid.org/downloads/xvidcore-$XVID_VERSION.tar.gz
tar -zxf xvidcore-$XVID_VERSION.tar.gz
cd xvidcore/build/generic
./configure --prefix=$PREFIX
make
$SUDO make install

cd $DIR_ROOT 
$SUDO rm -rf $SRC/xvidcore* 
echo "Installed Xvid"