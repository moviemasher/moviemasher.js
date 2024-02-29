cd $SRC

git clone --depth 1 https://chromium.googlesource.com/webm/libvpx.git
cd libvpx
# ./configure --prefix="${PREFIX}" --disable-examples --disable-unit-tests --enable-vp9-highbitdepth --as=yasm
./configure --prefix="${PREFIX}" 
--as=yasm 
--disable-debug 
--disable-docs 
--disable-examples 
--disable-install-bins 
--disable-unit-tests
--enable-pic 
--enable-shared 
--enable-vp9-highbitdepth 

make
$SUDO make install

cd $DIR_ROOT
$SUDO rm -rf $SRC/vpx* 
echo "Installed VPX"

