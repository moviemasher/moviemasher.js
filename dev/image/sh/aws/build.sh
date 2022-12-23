#!/bin/sh
set -e ;
source dev/image/sh/aws/options.sh ;
$SUDO yum update -y ;
$SUDO yum install -y $AWS_DEPENDENCIES ;
$SUDO amazon-linux-extras install epel -y;
