#!/bin/sh
set -e ;
source dev/image/sh/options.sh ;

# DEFINE TOOLS
REPL_DEPENDENCIES=''
TOOL_DEPENDENCIES='bzip2 cmake gcc gcc-c++ git libtool make nasm dpkg tar yasm yasm-devel' ;
