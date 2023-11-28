## Server Developer

The 
[lib-server](lib_server_src.md)
package provides back-end media processing functionality built upon 
[FFmpeg](https://ffmpeg.org). It is distributed through NPM as 
[@moviemasher/lib-server](https://www.npmjs.com/package/@moviemasher/lib-server)
and imports the following packages:
- [Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [lib-shared](lib_shared_src.md)
- [runtime-server](runtime_server_src.md)
- [runtime-shared](runtime_shared_src.md)

The server package is imported by a JavaScript runtime like 
[NodeJS](https://nodejs.org/) to facilitate processor-intensive media handling tasks. 
It is designed to support the [lib-client](lib_client_src.md) 
package, but this is not a requirement - the library can be used independently.

## Nomenclature

Server functionality is organized into three main types of processing:

- decoding: extracting information from media files
- encoding: rendering mashes into output media files
- transcoding: converting media files into other formats

This processing takes time and involves subprocesses, so is always performed 
asynchronously through a promise.  