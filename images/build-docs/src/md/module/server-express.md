## server-express

This module is an
[ExpressJS](https://expressjs.com)
reference implementation of a server plug-in that utilizes the core
[@moviemasher/lib-shared](https://www.npmjs.com/package/@moviemasher/lib-shared)
module.

It exports classes and interfaces that fulfill half a dozen APIs utilized by a client implementation like
[@moviemasher/lib-client](https://www.npmjs.com/package/@moviemasher/lib-client).
Its imports are all specified as peer dependencies.

This server implementation utilizes
[SQLite](https://www.sqlite.org/index.html),
[Node Media Server](https://github.com/illuspas/Node-Media-Server), and
[WebRTC](https://github.com/node-webrtc/node-webrtc) to support its data, rendering, and streaming APIs.

