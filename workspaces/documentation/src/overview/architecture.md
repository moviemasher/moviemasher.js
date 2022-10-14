## Architecture

The Movie Masher codebase is organized as a monorepo which is made available
in GitHub as [moviemasher/moviemasher.js](https://github.com/moviemasher/moviemasher.js).
This repository contains and builds several packages which are made available
in NPM:

- [@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) - core
  NPM package that uses the [SVG API](https://developer.mozilla.org/en-US/docs/Web/API/Svg_API)
  and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  to composite and mix audiovisual content in a timed and controlled way.

- [@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) - higher
  level NPM package that uses
  [ExpressJS](https://expressjs.com),
  [SQLite](https://www.sqlite.org/index.html),
  [Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg),
  [Node Media Server](https://github.com/illuspas/Node-Media-Server),
  [WebRTC](https://github.com/node-webrtc/node-webrtc),
  and the core package to provide server APIs that manage files, data, encoding, and streaming.

- [@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) - higher
  level NPM package that uses
  [ReactJS](https://reactjs.org)
  and both the core and icon packages to build a client user interface that facilitates playback and
  editing of content, as well as interactions with remote servers.

- [@moviemasher/theme-default](https://www.npmjs.com/package/@moviemasher/theme-default) - add-on NPM package that uses
  [React Icons](https://react-icons.github.io/react-icons/)
  to bundle a variety of SVG icons used in the UI.

All code is written in [TypeScript](https://www.typescriptlang.org) as strongly-typed
[ECMAScript](https://nodejs.org/api/esm.html) modules utilizing named exports. External
libraries are imported as peer dependencies to simplify bundling.
Any modern JavaScript transpiler should be able to treeshake, split, or otherwise repackage
the code to produce a bundle best optimized for final delivery.

## Repository Structure

- dev - shared configuration and assets
- docs - a local copy of this documentation
- node_modules - installed module depedencies
- packages - published NPM modules
  - client-react
  - moviemasher.js
  - server-express
  - theme-default
- workspaces - example deployments
  - example-core
  - example-express
  - example-express-react
  - example-react

## moviemasher.js

The core moviemasher.js NPM package has no dependencies, though portions do rely on
browser APIs not natively available in all execution environments. It defines core
interfaces into Movie Masher's data structures and classes, ultimately enabling playback and
composition of a variety of media assets within both client and server contexts.

It includes the core [[Mash]] interface which organizes assets into an edit decision
list (EDL) and supports [JSON](https://www.json.org) serialization for transport between client and server. It can be used in either context, though some methods are only valid in one or the other. 

In the client content, [[Editor]] provides methods which represent each discrete edit as a collection of [[Actions]], to support undo/redo history. It also provides [[Svgs]] representing the [[Tracks]] within the [[Mash]] for compositing within the browser. Learn more 
in the [Styling Overview](Styling.html).

In the server context, [[RenderingProcess]] provides methods which produce media files from a [[Mash]], using patterns and concepts established by
[FFmpeg](https://www.ffmpeg.org) like [[FilterGraphs]].
Learn more in the [Rendering Overview](Rendering.html).

## server-express

The server-express NPM package depends on moviemasher.js plus
[express](https://www.npmjs.com/package/express),
[sqlite](https://www.npmjs.com/package/sqlite),
[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg),
[node-media-server](https://www.npmjs.com/package/node-media-server),
and
[wtrc](https://www.npmjs.com/package/wrtc). It defines a collection of
[ExpressJS](https://expressjs.com) components responsible for housing content on a server
and transforming it into rendered files and streams.

The [[ApiServer]] is called by the [[ApiClient]] component to map each
[[Endpoint]] to an [[ApiCallback]] request before the client actually makes it.
The base implementation just maps back to the same server, but subclasses can use this
mechanism to dynamically route traffic to other servers. The client caches mapping based
on a time-to-live (TTL) value supplied by the server, so routing can potentially be
per-request.
Learn more about customizing client interaction in the [Server Developer Guide](ServerDeveloper.html).

The [[DataServer]] and [[FileServer]] store and deliver user JSON data and media assets
respectively. The base implementations use a local database and the file system, but
subclasses can swap out homespun or cloud-based solutions.

The [[RenderingServer]] renders a [[Mash]] into common video, audio, or image formats
while the [[StreamingServer]] streams a [[Cast]] in common formats.
The default implementations both rely on
[Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) which closely maps
to [FFmpeg](https://www.ffmpeg.org) arguments, so subclassing is possible.
Learn more about server encoding in the
[Rendering Overview](Rendering.html) and
[Streaming Overview](Streaming.html).

## client-react

The client-react NPM package depends on moviemasher.js and theme-default plus
[react](https://www.npmjs.com/package/react), with examples using
[react-dom](https://www.npmjs.com/package/react-dom).
It defines dozens of interoperable
[ReactJS](https://reactjs.org) function components that can be
combined to fit a wide variety of uses within a custom video editing application.

The [[ApiClient]] component provides a central mechanism for other components like [[Webrtc]]
that interact with a remote [[Server]]. It interacts with the [[ApiServer]] to determine
which other servers are supported, and map each [[Endpoint]] to an actual [[ApiCallback]]
request. It provides an [[ApiContext]] for child components to quickly see if their server
is supported and retrieve a fetch promise for each request.
Learn more about customizing server interaction in the [Client Developer Guide](ClientDeveloper.html).

The [[Masher]] component sits atop the [[Editor]] interface, allowing editing of
either a [[Cast]] or [[Mash]]. Context is provided to child components so they
can access the underlying editor, call its methods, and display its content.

Higher level components like [[Player]] and [[Timeline]] logically organize particular
functionality, in this case [[Mash]] display and [[Track]] editing. They both provide
context for specific child components like
[[PlayerButton]] and [[TimelineScrubber]] to operate within.
For [[Cast]] display and [[Layer]] editing the
[[Streamer]] and [[Composer]] components provide similiar functionality.
The [[Browser]] and [[Inspector]] components provide a unified context for adding and
altering content.
Learn more about creating custom user interfaces in the [Client Developer Guide](ClientDeveloper.html).

## theme-default

The theme-default NPM package has no runtime dependencies, but depends on 
[react-icons](https://www.npmjs.com/package/react-icons) during bundling. It packages icons into SVG content wrapped in JavaScript code, so this time consuming bundling step can be avoided in the client-react package. Learn more about creating custom user interfaces in the [Styling Overview](Styling.html).