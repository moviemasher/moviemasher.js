#!/bin/sh
set -e ;
source dev/image/sh/tools/options.sh ;

$SUDO yum remove -y $TOOL_DEPENDENCIES ;
$SUDO yum clean all ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* ;
$SUDO yum autoremove -y ;
$SUDO rm -r dev ;