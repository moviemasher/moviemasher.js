#!/bin/sh
set -e ;
source dev/image/sh/options.sh ;

$SUDO yum update -y ;
$SUDO amazon-linux-extras install -y epel ;
$SUDO yum install -y $TOOL_DEPENDENCIES ;
