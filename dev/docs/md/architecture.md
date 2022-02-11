## Architecture

The Movie Masher codebase is organized as a monorepo which is made available
in GitHub as [moviemasher/moviemasher.js](https://github.com/moviemasher/moviemasher.js).
This repository contains and builds several packages which are made available
in NPM:

- [@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) - core
  NPM package that uses the [Canvas Api](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
  and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  to composite and mix audiovisual content in a timed and controlled way.

- [@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) - higher
  level NPM package that uses
  [ReactJS](https://reactjs.org)
  and the core package to build a client user interface that facilitates playback and
  editing of content, as well as interactions with remote servers.

- [@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) - higher
  level NPM package that uses
  [ExpressJS](https://expressjs.com),
  [SQLite](https://www.sqlite.org/index.html),
  [Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg),
  [Node Media Server](https://github.com/illuspas/Node-Media-Server),
  [WebRTC](https://github.com/node-webrtc/node-webrtc),
  and the core package to provide server APIs that manage files, data, encoding, and streaming.

All code is written in [TypeScript](https://www.typescriptlang.org) as strongly-typed
[ECMAScript](https://nodejs.org/api/esm.html) modules utilizing named exports. External
libraries are imported as peer dependencies to simplify bundling.
Any modern JavaScript transpiler should be able to treeshake, split, or otherwise repackage
the code to produce a bundle best optimized for final delivery.

## moviemasher.js

The core moviemasher.js NPM package has no dependencies, though portions do rely on
browser APIs not natively available in all execution environments. It defines core
interfaces into Movie Masher's data structures and classes, ultimately enabling playback and
composition of a variety of media assets within both client and server contexts.

Core interfaces include [[Mash]] which organizes assets into an edit decision
list (EDL), and [[MashEditor]] which provides methods to edit it and selectively composite its content.
Learn more about how mashes are composited within different contexts
in the [Rendering Guide](rendering.html).

Similarly, the [[Cast]] interface organizes mashes for use within a streaming session,
while [[CastEditor]] provides methods to edit it and selectively composite its content.
Learn more about how mashes are composited by streams
in the [Streaming Guide](streaming.html).

In both cases, editors handle [JSON](https://www.json.org) serialization of their respective
content for transport between client and server. During editing they encapsulate each
operation within a discrete {@link Action} to support undo/redo history.
When compositing visual content they use patterns and concepts established by
[FFmpeg](https://www.ffmpeg.org) like [[FilterGraph]] and [[FilterChain]].

## client-react

The client-react NPM package depends on moviemasher.js plus
[react](https://www.npmjs.com/package/react), with examples using
[react-dom](https://www.npmjs.com/package/react-dom).
It defines dozens of interoperable
[ReactJS](https://reactjs.org) function components that can be
combined to fit a wide variety of uses within a custom video editing application.

The [[Api]] component provides a central mechanism for other components like [[Webrtc]]
that interact with a remote [[Server]]. It interacts with the [[ApiServer]] to determine
which other servers are supported, and map each [[Endpoint]] to an actual [[ApiCallback]]
request. It provides an [[ApiContext]] for child components to quickly see if their server
is supported and retrieve a fetch promise for each request.
Learn more about customizing server interaction in the [Integration Guide](integration.html).

The [[Masher]] and [[Caster]] components sit atop the
[[MashEditor]] and [[CastEditor]] interfaces. The former can be placed inside the later,
since a [[Cast]] contains at least one [[Mash]] that can be edited. Both components
provide context for child components to access the underlying editor,
call its methods, and display its content.

Higher level components like [[Player]] and [[Timeline]] logically organize particular
functionality, in this case [[Mash]] display and [[Track]] editing. They both provide
context for specific child components like
[[PlayerButton]] and [[TimelineScrubber]] to operate within.
For [[Cast]] display and [[Layer]] editing the
[[Streamer]] and [[Layers]] components provide similiar functionality.
The [[Browser]] and [[Inspector]] components provide a unified context for adding and
altering content.
Learn more about creating custom user interfaces in the [Layout Guide](layout.html).

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

The [[ApiServer]] is called by the [[Api]] client component to map each
[[Endpoint]] to an [[ApiCallback]] request before the client actually makes it.
The base implementation just maps back to the same server, but subclasses can use this
mechanism to dynamically route traffic to other servers. The client caches mapping based
on a time-to-live (TTL) value supplied by the server, so routing can potentially be
per-request.
Learn more about customizing client interaction in the [Integration Guide](integration.html).

The [[DataServer]] and [[FileServer]] store and deliver user JSON data and media assets
respectively. The base implementations use a local database and the file system, but
subclasses can swap out homespun or cloud-based solutions.

The [[RenderingServer]] renders a [[Mash]] into common video, audio, or image formats
while the [[StreamingServer]] streams a [[Cast]] in common formats.
The default implementations both rely on
[Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) which closely maps
to [FFmpeg](https://www.ffmpeg.org) arguments, so subclassing is possible.
Learn more about server encoding in the
[Rendering Guide](rendering.html) and
[Streaming Guide](streaming.html).
