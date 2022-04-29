#!/bin/sh
set -e ;
source dev/image/sh/options.sh


$SUDO amazon-linux-extras enable python$PYTHON_VERSION ;
$SUDO yum install -y python$PYTHON_VERSION ;

npx whereis python ;
python --version;
npx whereis python$PYTHON_VERSION ;
python$PYTHON_VERSION --version;

npm config set python python$PYTHON_VERSION
