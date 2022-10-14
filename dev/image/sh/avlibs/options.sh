#!/bin/sh
set -e ;
source dev/image/sh/options.sh

# DEFINE LIBRARIES
AV_DEPENDENCIES='freetype-devel fontconfig-devel fribidi-devel frei0r-devel libogg-devel libsamplerate-devel libsndfile-devel speex-devel librsvg2-devel libtheora-devel libvorbis-devel libmad-devel libid3tag-devel' ;

AMR_VERSION='0.1.3' ;
LAME_VERSION='3.100' ;
OPUS_VERSION='1.3.1' ;
VPX_VERSION=1.8.0 ;
XVID_VERSION='1.3.5' ;
