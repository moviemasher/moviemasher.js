#!/bin/sh
set -e ;
source dev/image/sh/python/options.sh

$SUDO yum remove -y python$PYTHON_VERSION ;
