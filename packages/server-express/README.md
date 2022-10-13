<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, switcher_
- _visual compositing_ through **SVG API**
- _audio mixing_ through **WebAudio API** 
- _client_ implemented in **ReactJS** 
- _server_ implemented in **ExpressJS**  
- _encode_ and _stream_ through **FFmpeg**
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

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=../../workspaces/documentation/md/snippet/example-server.md&stripMagic=true) -->
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
const MovieMasherServer = require("@moviemasher/server-express")

const { Host } = MovieMasherServer
const options = { 
  port: 8572, host: '0.0.0.0', 
  api: { authentication: { type: 'basic' } } 
}
const host = new Host(options)
host.start()
```
</fieldset>

The script first requires MovieMasherServer, then destructures what's needed from it. In this example we're just grabbing the `Host` class and corresponding `HostDefaultOptions` function. We call the later with the desired port number, and then pass the options it returns as arguments to the class constructor. Finally, the `start` method of the new instance is called to start the ExpressJS server. 

While the server is running, requests can be made to http://localhost:8570 following half a dozen APIs that save data, handle uploads, render video, etc. 

| <svg width="1rem" height="1rem" viewBox="0 0 512 512"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" stroke="none" fill="currentColor" /></svg> | _Please note_ |
| -- | -- |
|  | This example installs an FFmpeg build that has limited rendering capabilities due to lack of support of SVG files. Typically a custom build is utilized instead. Learn more about integrating your own services in the [Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html). |
<!-- MAGIC:END -->

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/foot.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please review the [Contributor Guide](https://moviemasher.com/docs/Contributor.html) and [send an email](mailto:connect27@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
