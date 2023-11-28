## lib-server

The 
[@moviemasher/lib-server](https://www.npmjs.com/package/@moviemasher/lib-server)
module can be imported directly into your project to add video encoding, decoding, 
and transcoding functionality. It exports types, interfaces, classes, and functions
that support responding to server events. It requires an installation of 
[FFmpeg](https://ffmpeg.org) with font and SVG support enabled, and 
imports 
[Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
to interact with it. 

This module is built from code and configuration available in the
[Movie Masher Github Repository](https://github.com/moviemasher/moviemasher.js).
The NPM distribution includes TypeScript source code files, as well as minified 
JavaScript files intended to be imported 
directly. Each source file is distributed individually as a
separate JavaScript file. The JavaScript includes source maps to the 
TypeScript for easier debugging. Some JSON data files are also included containing 
default icons and assets. 
