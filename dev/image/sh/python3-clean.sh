#!/bin/sh
set -e ;
source dev/image/sh/options.sh

$SUDO yum remove -y python$PYTHON_VERSION ;
