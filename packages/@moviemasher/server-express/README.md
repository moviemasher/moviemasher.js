<!-- MAGIC:START (FILEMD:src=md/snippet/head.md) -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_TypeScript video editor and encoder_
- **edit** video, audio, and images in [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
- **encode** high resolution media files using [FFmpeg](https://ffmpeg.org)
- **customize** the editor with standard [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **extend** the system by listening for [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) 

<!-- MAGIC:END -->



<!-- MAGIC:START (FILEMD:src=md/module/server-express.md) -->
## server-express

This module is an
[ExpressJS](https://expressjs.com)
reference implementation of a server plug-in that utilizes the core
[@moviemasher/shared-lib](https://www.npmjs.com/package/@moviemasher/shared-lib)
module.

It exports classes and interfaces that fulfill half a dozen APIs utilized by a client implementation like
[@moviemasher/client-lib](https://www.npmjs.com/package/@moviemasher/client-lib).
Its imports are all specified as peer dependencies.

This server implementation utilizes
[SQLite](https://www.sqlite.org/index.html),
[Node Media Server](https://github.com/illuspas/Node-Media-Server), and
[WebRTC](https://github.com/node-webrtc/node-webrtc) to support its data, rendering, and streaming APIs.


<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=md/snippet/documentation.md) -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=md/examples/client.md&stripMagic=1) -->
## Client Example

The HTML document below can be hosted on a web server to deliver the Movie Masher application. 
The first SCRIPT element is an 
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
which tells the browser where to import the Movie Masher and Lit modules. 
The second SCRIPT element imports the MOVIE-MASHER custom element, which is then used in the BODY.
<details open>

<summary>example.html</summary>
<hr/>


```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Movie Masher Example</title>
    <script type='importmap'>{
      "imports": {
        "@moviemasher/client-lib/": "https://unpkg.com/@moviemasher/client-lib@5.2.0/dist/", 
        "@moviemasher/shared-lib/": "https://unpkg.com/@moviemasher/shared-lib@5.2.0/dist/",
        "@lit-labs/observers/": "https://unpkg.com/@lit-labs/observers@2.0.0/",
        "@lit/reactive-element": "https://unpkg.com/@lit/reactive-element@1.6.3/reactive-element.js",
        "@lit/reactive-element/": "https://unpkg.com/@lit/reactive-element@1.6.3/",
        "lit-element/": "https://unpkg.com/lit-element@3.3.3/",
        "lit-html": "https://unpkg.com/lit-html@2.8.0/lit-html.js",
        "lit-html/": "https://unpkg.com/lit-html@2.8.0/",
        "lit/": "https://unpkg.com/lit/@2.8.0/"
      }
    }</script>
    <script type='module'>
      import '@moviemasher/client-lib/movie-masher.js';
    </script>
    <style>
      body {
        height: 100vh;
        display: flex;
        margin: 0px;
        padding: 0px;
        font-family: sans-serif;
      }
      @media(prefers-color-scheme: dark) {
        body { background-color: #2d1e05; color: #fff; }
      }
    </style>
  </head>
  <body>
    <movie-masher></movie-masher>
  </body>
</html>
```

</details>

Without additional styling the `MovieMasherElement` element will fill its container both horizontally and vertically, with some padding. In this example we use the STYLE element to define the BODY as an unpadded flex box so it fills the whole viewport. We also use a media query to set a page background color when the user's device is in dark mode (the editor adjusts automatically). 

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

