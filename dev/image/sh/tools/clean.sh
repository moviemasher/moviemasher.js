#!/bin/sh
set -e ;
source dev/image/sh/tools/options.sh ;

$SUDO yum remove -y $TOOL_DEPENDENCIES ;
