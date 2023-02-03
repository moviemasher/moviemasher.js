cd $SRC 

curl -L https://git.io/n-install --output n-install
chmod +x n-install
yes y | ./n-install
$HOME/n/bin/n $INSTALL_NODE

cd $DIR_ROOT
$SUDO rm -rf $SRC/n-install* 
$SUDO rm -rf $HOME/n/* 
echo "Installed NodeJS ${INSTALL_NODE}"