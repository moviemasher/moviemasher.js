#!/bin/sh
set -e ;

# DEFINE ARGUMENT DEFAULTS
SUDO=''
DIR_BINARY='/usr/bin' ;
PREFIX='/usr' ;
SRC='/usr/local' ;

while getopts s:n:b:u: flag
do
  case "${flag}" in
    s) SUDO='sudo';;
    n) DIR_BINARY=${OPTARG};;
    b) PREFIX=${OPTARG};;
    u) SRC=${OPTARG};;
  esac
done

# DEFINE VERSIONS
VERSION_AMR='0.1.3' ;
VERSION_FFMPEG='5.0.1' ;
VERSION_LAME='3.100' ;
VERSION_OPUS='1.3.1' ;
VERSION_XVID='1.3.5' ;
VERSION_NODE='16.x' ;
VERSION_NPM='8.6.0' ;
VERSION_ZMQ='5.2.8' # first supported by ffmpeg


$SUDO yum install -y libunwind-devel ;
$SUDO ldconfig ;
$SUDO whereis libunwind ;
