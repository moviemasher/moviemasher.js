<!-- MAGIC:START (FILEMD:src=md/snippet/head.md) -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_TypeScript video editor and encoder_
- **edit** video, audio, and images in [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
- **encode** high resolution media files using [FFmpeg](https://ffmpeg.org)
- **customize** the editor with standard [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **extend** the system by listening for [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) 

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=md/module/shared-lib.md) -->
## shared-lib

The 
[@moviemasher/shared-lib](https://www.npmjs.com/package/@moviemasher/shared-lib)
module is imported by high-level libraries like 
[@moviemasher/client-lib](https://www.npmjs.com/package/@moviemasher/client-lib) 
and
[@moviemasher/server-lib](https://www.npmjs.com/package/@moviemasher/server-lib),
and not typically installed directly. 
It exports classes and functions needed both on the server and in the client.

This module is built from code and configuration available in the
[Movie Masher Github Repository](https://github.com/moviemasher/moviemasher.js).
The NPM distribution includes TypeScript source code files, as well as minified 
JavaScript files intended to be imported 
directly by other modules. Each source file is distributed individually as a
separate JavaScript file. The JavaScript includes source maps to the 
TypeScript for easier debugging. 

<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=md/snippet/documentation.md) -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.

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
