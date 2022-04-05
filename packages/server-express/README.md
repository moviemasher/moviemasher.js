<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, and streamer - version 5.0.5_

- _visual compositing_ through **Canvas API**
- _audio mixing_ through **WebAudio API**
- _encoding_ and _streaming_ through **FFmpeg**
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

<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
[more extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

## Installation

The following shell command installs the server and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```

_Please note_ that this does not install a client implementation that interacts with this module.
Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

<!-- MAGIC:START (FILEMD:src=../../dev/docs/md/snippet/example-server.md&stripMagic=true) -->
## Server Example

<fieldset>

<legend>server.ts</legend>


```ts
import path from 'path'
import { Host, DefaultHostOptions, expandToJson } from '@moviemasher/server-express'

const configuration = process.argv[2] || path.resolve(__dirname, './server-config.json')
const options = expandToJson(configuration)
const host = new Host(DefaultHostOptions(options))
host.start()
```
</fieldset>

In this example we're using the
[DefaultHostOptions](https://moviemasher.com/docs/function/DefaultHostOptions.html) function to
create the [Host](https://moviemasher.com/docs/component/Host.html) constructor arguments from a JSON file with the following structure:

<fieldset>

<legend>server-config.json</legend>


```json
{
  "port": 8570,
  "previewSize": { "width": 480, "height": 270 },
  "outputSize": { "width": 1920, "height": 1080 }
}
```
</fieldset>

We are setting the preview dimensions to their default for demonstration purposes. The server will pass these to the client and the client will apply them, but only after the CSS is applied so a resize will be visible if they differ. Preview dimensions should be overridden either in the client, or better still, in the CSS. If the defaults are overidden there they should be here too, since the client does NOT pass them to the server. The rendering server uses them to optimally size previews of uploaded video and images.

We are also setting the output dimensions here, which are used as default values for both the rendering and streaming servers. Please note: they should always be an even multiple of the preview dimensions - in this case it's a multiple of four. Using different aspect ratios is actually supported, but then the preview in the client will not match the output of these servers.

Learn more about building your own customized server in the
[Integration Guide](https://moviemasher.com/docs/Integration.html).

<!-- MAGIC:END -->

<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/foot.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect27@moviemasher.com)
to discuss ways to contribute to the project.
<!-- MAGIC:END -->
