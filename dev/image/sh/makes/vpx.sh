cd $SRC
$SUDO mkdir vpx
cd vpx
curl -sL https://codeload.github.com/webmproject/libvpx/tar.gz/v${VPX_VERSION} | tar -zx --strip-components=1
./configure --prefix="${PREFIX}" --as=yasm --enable-vp8 --enable-vp9 --enable-vp9-highbitdepth --enable-pic --enable-shared --disable-debug --disable-examples --disable-docs --disable-install-bins --disable-unit-tests
make
$SUDO make install


cd $DIR_ROOT
$SUDO rm -rf $SRC/vpx* 
echo "Installed VPX"