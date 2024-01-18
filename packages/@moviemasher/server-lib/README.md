<!-- MAGIC:START (FILEMD:src=md/snippet/head.md) -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_TypeScript video editor and encoder_
- **edit** video, audio, and images in [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
- **encode** high resolution media files using [FFmpeg](https://ffmpeg.org)
- **customize** the editor with standard [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **extend** the system by listening for [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) 

<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=md/module/server-lib.md) -->
## server-lib

The 
[@moviemasher/server-lib](https://www.npmjs.com/package/@moviemasher/server-lib)
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

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=md/snippet/documentation.md) -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.

<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=md/examples/server.md&stripMagic=true) -->
## Server Example

The following shell command installs the server and required packages to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-lib --save
```

The script below can then be included in your project and triggered in a variety of ways. The most straightfoward is to simply pass its path directly to node.

<fieldset>

<legend>server.js</legend>


```js
// src/server.ts
import { Host, HostDefaultOptions } from "@moviemasher/server-lib";
var host = new Host(HostDefaultOptions());
host.start();
```


</fieldset>

The script first requires MovieMasherServer, then destructures what's needed from it. In this example we're just grabbing the `Host` class and corresponding `HostDefaultOptions` function. We call the later with the desired port number, and then pass the options it returns as arguments to the class constructor. Finally, the `start` method of the new instance is called to start the ExpressJS server. 

While the server is running, requests can be made to http://localhost:8570 following half a dozen APIs that save data, handle uploads, render video, etc. 

### _Please note_
This example installs an FFmpeg build that has limited rendering capabilities due to lack of support of SVG files. Typically a custom build is utilized instead. Learn more about integrating your own services in the [Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html).
<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=md/snippet/foot.md) -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect34@moviemasher.com) to discuss ways to work on the project.

<!-- MAGIC:END -->
