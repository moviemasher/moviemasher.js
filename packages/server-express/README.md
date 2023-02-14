<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/head.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor and encoder_
_JavaScript video editor and encoder_
- _visual compositing_ through **SVG API**
- _audio mixing_ through **WebAudio API**
- _encode_ and _transcode_ through **FFmpeg**
- _client_ implemented in **ReactJS**
- _server_ implemented in **ExpressJS**
<!-- MAGIC:END -->

## Express Server Plug-in
This module is an
[ExpressJS](https://expressjs.com)
reference implementation of a server plug-in that utilizes the core
[@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js)
module.

It exports classes and interfaces that fulfill half a dozen APIs utilized by a client implementation like
[@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react).
Its imports are all specified as peer dependencies.

This server implementation utilizes
[SQLite](https://www.sqlite.org/index.html),
[Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg),
[Node Media Server](https://github.com/illuspas/Node-Media-Server), and
[WebRTC](https://github.com/node-webrtc/node-webrtc) to support its data, rendering, and streaming APIs.

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=../../workspaces/documentation/src/snippet/example-server.md&stripMagic=true) -->
## Server Example

The following shell command installs the server and required packages to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```

The script below can then be included in your project and triggered in a variety of ways. The most straightfoward is to simply pass its path directly to node.

<fieldset>

<legend>server.js</legend>


```js
// src/server.ts
import { Host, HostDefaultOptions } from "@moviemasher/server-express";
var host = new Host(HostDefaultOptions());
host.start();
```
</fieldset>

The script first requires MovieMasherServer, then destructures what's needed from it. In this example we're just grabbing the `Host` class and corresponding `HostDefaultOptions` function. We call the later with the desired port number, and then pass the options it returns as arguments to the class constructor. Finally, the `start` method of the new instance is called to start the ExpressJS server. 

While the server is running, requests can be made to http://localhost:8570 following half a dozen APIs that save data, handle uploads, render video, etc. 

### _Please note_
This example installs an FFmpeg build that has limited rendering capabilities due to lack of support of SVG files. Typically a custom build is utilized instead. Learn more about integrating your own services in the [Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html).
<!-- MAGIC:END -->

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/foot.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please review the [Contributor Guide](https://moviemasher.com/docs/Contributor.html) and [send an email](mailto:connect27@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
