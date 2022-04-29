#!/bin/sh
set -e ;
source dev/image/sh/options.sh

$SUDO yum remove -y $TOOL_DEPENDENCIES ;
$SUDO yum clean all ;
$SUDO rm -rf /tmp/* /var/tmp/* /var/cache/* ;
# $SUDO yum autoremove -y ;
