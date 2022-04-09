<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, and streamer - version 5.0.6_

- _visual compositing_ through **Canvas API**
- _audio mixing_ through **WebAudio API**
- _encoding_ and _streaming_ through **FFmpeg**
- _client_ implemented in **ReactJS**
- _server_ implemented in **ExpressJS**
<!-- MAGIC:END -->

## Core Library

This module is a peer dependency of both
[@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) and
[@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) modules, and not typically installed directly. It exports core interfaces, classes, factories, utility methods, enumerations, and types related to creating, managing and rendering video edit decision lists.

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

The following shell command installs just the core library to your NPM project,
saving it to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/moviemasher.js --save
```

_Please note_ that this does not install a client or server implementation that utilizes this module.
Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

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
