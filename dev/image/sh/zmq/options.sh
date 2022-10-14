#!/bin/sh
set -e ;
source dev/image/sh/options.sh

LIBZMQ_VERSION='4.3.2' # first supported by ffmpeg
# LIBZMQ_VERSION='5.2.8' # more up to date

LIBZMQ_SHA256SUM="02ecc88466ae38cf2c8d79f09cfd2675ba299a439680b64ade733e26a349edeb v4.3.2.tar.gz"

VERSION_ZMQJS=5 #'6.0.0-beta.6' #'5.2.8' #

