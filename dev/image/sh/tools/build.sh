#!/bin/sh
set -e ;
source dev/image/sh/tools/options.sh ;

$SUDO yum update -y ;
$SUDO amazon-linux-extras install -y epel ;
$SUDO yum install -y $TOOL_DEPENDENCIES ;
