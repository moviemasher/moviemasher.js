#!/bin/sh
set -e ;
source dev/image/sh/aws/options.sh ;

$SUDO yum remove -y $AWS_DEPENDENCIES ;
$SUDO yum clean all ;
# $SUDO yum autoremove -y ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* ;
# $SUDO rm -r dev ;