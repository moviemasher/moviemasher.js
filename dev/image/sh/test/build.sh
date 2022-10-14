#!/bin/sh
set -e
source dev/image/sh/options.sh

# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
TEST_DEPENDENCIES='alsa-lib atk cups gtk3 ipa-gothic-fonts libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango xorg-x11-fonts xorg-x11-utils xorg-x11-font-utils' ;

$SUDO yum install -y $TEST_DEPENDENCIES

$SUDO yum update nss -y
