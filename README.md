<!-- MAGIC:START (FILE:src=dev/documentation/snippet/head.md) -->
<!-- The below content is automatically added from dev/documentation/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor and encoder_
- **edit** video, audio, and images in [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
- **encode** high resolution media files using [FFmpeg](https://ffmpeg.org)
- **customize** the editor with standard [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **extend** the system by listening for [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
<!-- MAGIC:END -->


## Description
Movie Masher adds media editing and encoding capabilities to your web application. 
The client interface is implemented as a collection of standard
Web Components (Custom HTML Elements)
which integrate easily with popular reactive libraries like
[Svelte](https://svelte.dev), 
[Vue](https://vuejs.org), and 
[React](https://react.dev). 
The server interface is built atop 
[FFmpeg](https://ffmpeg.org) and designed to integrate with common 
runtimes like 
[Node.js](https://nodejs.org)
and
[Deno](https://deno.land). The client and server are both strongly typed and utilize standard
JavaScript Events
to facilitate a modular architecture. 
The provided examples demonstrate deploying on a variety of platforms like 
[AWS](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6), 
[Supabase](https://supabase.com), and 
[ExpressJS](https://expressjs.com). 

### _NEW in version 5.1.2_
- switched from React to Web Components
- switched to Event-based plugin architecture
- upgraded to FFmpeg 5
- upgraded to NodeJS 18

<!-- MAGIC:START (FILE:src=dev/documentation/snippet/documentation.md) -->
<!-- The below content is automatically added from dev/documentation/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

## Availability

All Movie Masher source code is available in TypeScript format under a permissive 
[MIT License](https://opensource.org/licenses/MIT) 
from the 
[Github repository](https://github.com/moviemasher/moviemasher.js).
Optimized 
[client](https://www.npmjs.com/package/@moviemasher/lib-client) 
and 
[server](https://www.npmjs.com/package/@moviemasher/lib-server) 
packages are available from NPM in modern ESM2020 format, allowing you to directly
import them into your HTML from CDNs like unpkg.com _without_ a build step. 

A fully functional standalone deployment can be easily launched from within the
[AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6). 
A similar image is available from 
[DockerHub](https://hub.docker.com/r/moviemasher/moviemasher.js/) 
to facilitate local development and testing.

## Docker Usage

A fully functional demo of the system can be launched locally within Docker using the following command:

```shell
docker run -d -p '8573:8573' --name moviemasher moviemasher/moviemasher.js:5.1.2
```

Then navigate to http://localhost:8573 in your browser, supplying _any_ username/password
combination when prompted. When you're done exploring the demo it can be terminated and cleaned up with:

```shell
docker kill moviemasher
docker rm moviemasher
```

<!-- MAGIC:START (FILE:src=dev/documentation/snippet/foot.md) -->
<!-- The below content is automatically added from dev/documentation/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect34@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
