## Server Developer

The 
[server-lib](lib_server_src.md)
package provides back-end media processing functionality built upon 
[FFmpeg](https://ffmpeg.org). It is distributed through NPM as 
[@moviemasher/server-lib](https://www.npmjs.com/package/@moviemasher/server-lib)
and imports the following packages:
- [Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [shared-lib](lib_shared_src.md)

The server package is imported by a JavaScript runtime like 
[NodeJS](https://nodejs.org/) to facilitate processor-intensive media handling tasks. 
It is designed to support the [client-lib](lib_client_src.md) 
package, but this is not a requirement - the library can be used independently.

## Nomenclature

Server functions are organized into three main types of tasks:

- `decode`: extract information from a media file
- `encode`: render a mash into a media file
- `transcode`: convert a media file into another format

These tasks take time and involve subprocesses, so functions all return a 
promise and operate asynchronously. The promise resolves when the task is 
complete, but it's also possible to check the status of the operation by calling 
the `encodeStatus`, `decodeStatus`, or `transcodeStatus` function.

These functions all need to operate on **local** files, so any remote ones will
be downloaded before processing begins. 

## Decoding
Media files typically contain metadata that describe the contents of the file. 
For example, an image file's metadata includes the dimensions of the image while
an audio file's metadata includes the duration of the audio. The `decodeProbe` 
function extracts this metadata from a media file and returns it as a `Decoding` object.

Decoding is not strictly necessary since the client is able to extract the metadata
it needs from the raw file itself. However, decoding assures that the file can
be properly processed by the server. 

## Encoding
Media files can be combined and encoded into a single output file of any type. 
The `encode` function converts a mash to a media file and returns its 
path in an `Encoding` object.

Typically the client creates the `MashAssetObject` this function needs, but it's
also possible to create one manually. 

## Transcoding
Media files are typically much higher resolution than the client needs in order
to display its preview. Transcoding is used to create a lower resolution
version of a media file for the client to work with. The `transcode` 
function converts a media file and returns its path in a `Transcoding` object.

For instance, the client transcodes an imported video file into a separate audio 
file and an image sequence (literally a series of image files). The client is 
able to display these image frames individually as needed, greatly reducing 
bandwidth requirements as the video is randomly accessed in the timeline. The 
audio file is not loaded until the video is actually played. 

Transcoding is not strictly necessary since the client is able to extract audio
and frame data from the raw file itself. However, this is a very processor-intensive
task, so it's best to provide the client with a transcoded version.
