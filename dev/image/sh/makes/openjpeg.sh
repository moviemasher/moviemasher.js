cd $SRC
git clone https://github.com/uclouvain/openjpeg.git
$SUDO mkdir openjpeg/build
cd openjpeg/build
cmake .. -DCMAKE_INSTALL_PREFIX=$PREFIX  
# -DBUILD_THIRDPARTY:BOOL=ON 
# -DBUILD_SHARED_LIBS:bool=off -DCMAKE_BUILD_TYPE=Release
make
$SUDO make install

cd $DIR_ROOT
$SUDO rm -rf $SRC/openjpeg* 
echo "Installed OpenJPEG"