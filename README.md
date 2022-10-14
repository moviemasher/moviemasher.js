<!-- MAGIC:START (FILE:src=workspaces/documentation/md/snippet/head.md) -->
<!-- The below content is automatically added from workspaces/documentation/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, switcher_
- _visual compositing_ through **SVG API**
- _audio mixing_ through **WebAudio API** 
- _client_ implemented in **ReactJS** 
- _server_ implemented in **ExpressJS**  
- _encode_ and _stream_ through **FFmpeg**
<!-- MAGIC:END -->

## Description
Movie Masher is a web-based video editor built entirely in TypeScript and available as a collection of modern ESM packages. It consists of a core library shared by both a React client and ExpressJS server. The client provides an optimized, low resoluition editing experience while the server renders out the result as a high quality video. 

### _NEW in version 5.1.0_
- container/content pattern
- vector-based masking
- transform/color tweening
- reorganized inspector


<!-- MAGIC:START (FILE:src=workspaces/documentation/md/snippet/documentation.md) -->
<!-- The below content is automatically added from workspaces/documentation/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

## Availability

Movie Masher is packaged into several formats and published on some of the most popular platforms. The [core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js) 
as well as the
[server](https://www.npmjs.com/package/@moviemasher/server-express), 
[client](https://www.npmjs.com/package/@moviemasher/client-react), and
[theme](https://www.npmjs.com/package/@moviemasher/theme-default) plug-in
packages can all be installed through NPM individually, for those wanting an optimized build. 
These are also available in UMD format through unpkg.com's CDN for simple
inclusion directly into HTML pages.  

The source code for these artifacts resides in the [Github repository](https://github.com/moviemasher/moviemasher.js), for those wishing to contribute to the project. 
The [DockerHub image](https://hub.docker.com/r/moviemasher/moviemasher.js/) 
provides a functional demo you can run and build upon locally,
while the
[AMI](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6)
in AWS Marketplace does the same within their hosted environment.

## Docker Usage

A fully functional demo of the system including server rendering can easily be launched within Docker using the following command:

```shell
docker run -d -p '8570:8570' --name moviemasher moviemasher/moviemasher.js:5.1.0
```

Then navigate to http://localhost:8570 in your browser, supplying any username/password
combination when prompted. When you're done exploring the demo it can be terminated and cleaned up with:

```shell
docker kill moviemasher
docker rm moviemasher
```



<!-- MAGIC:START (FILEMD:src=workspaces/documentation/md/snippet/example-core.md&stripMagic=true) -->
## Core Example

The HTML document below can be loaded in a web browser to display the simplest 'hello world' example. The SCRIPT tag within the HEAD tag loads the UMD version of the core library directly from NPM through a CDN. The BODY contains just an empty DIV tag followed by another SCRIPT tag containing code that uses the library to populate it with Elements. 

<fieldset>
<legend>moviemasher.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher Express Example</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src="https://unpkg.com/@moviemasher/moviemasher.js@5.1.0/umd/moviemasher.js" crossorigin></script>
    <style>
      #root { width: 360px; height: 640px; }
      #root > * { position: absolute; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
const element = document.getElementById('root')
const { editorInstance, TextContainerId } = MovieMasher
const dimensions = element.getBoundingClientRect()
const editor = editorInstance({ dimensions })
const clip = { 
  container: { string: 'Hello World!' }, containerId: TextContainerId
}
const mash = { tracks: [{ clips: [clip] }] }
editor.load({ mash }).then(() => {
  editor.previewItems().then(elements => element.append(...elements))
})
    </script>
  </body>
</html>
```
</fieldset>

The SCRIPT code first stores the DIV element in the `element` variable and then destructures what's needed from the core library. The `editorInstance` method is used to construct an editor, which is a specialized object capable of loading and previewing content. The SVG's bounding rect is provided to the editor so it knows how big a preview to generate. 

This example includes just a single text clip on a single track, but multiple tracks containing multiple clips of different types could be provided. In Movie Masher, text is a kind of container so we specify `TextContainerId` as the clip's `containerId` and populate `container` with the `string` we want to display. 

This clip is then nested within a mash object which is passed to the editor's `load` method. This returns a promise that resolves once the first frame can be displayed, in this case waiting until the default font is loaded. The editor's `svgItems` method is then called which returns another promise that resolves with an array of elements. These are simply then appended to our SVG tag. 

### _Please note_
This example will only display what's on the first frame of our mash and will not update if we subsequently use the editor to make changes. More typically the client package is used, even when just displaying a mash. Learn more about how the codebase is structured in the [Architecture Overview](https://moviemasher.com/docs/Architecture.html).


<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=workspaces/documentation/md/snippet/example-client.md&stripMagic=true) -->
## Client Example

The HTML document below can simply be loaded in a web browser to display a 'hello world' example. The HEAD contains tags that load React and Movie Masher in UMD (Universal Module Definition) format directly from NPM through a CDN. The BODY contains just an empty DIV element followed by a SCRIPT that uses React to display Movie Masher, prepopulated with a text clip...

<fieldset>
<legend>umd.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher React Example</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='https://unpkg.com/react@18/umd/react.production.min.js' crossorigin></script>
    <script src='https://unpkg.com/react-dom@18/umd/react-dom.production.min.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/moviemasher.js@5.1.0/umd/moviemasher.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/theme-default@5.1.0/umd/theme-default.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/client-react@5.1.0/umd/client-react.js' crossorigin></script>
    <link href='https://unpkg.com/@moviemasher/theme-default@5.1.0/moviemasher.css' rel='stylesheet'>
    <style> /* fit root DIV to viewport */
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #root { width: 100vw; height: 100vh; display: flex; }
    </style>
  </head>
  <body>
    <div id='root' class='moviemasher'></div>
    <script>

// create constant referencing root DIV element
const element = document.getElementById('root')

// destructure constants from packages
const { createElement } = React
const { createRoot } = ReactDOM
const { Masher, MasherDefaultProps } = MovieMasherClient
const { TextContainerId } = MovieMasher

// create mash object containing text clip on a track
const clip = { 
  container: { string: 'Hello World!' }, 
  containerId: TextContainerId
}
const mash = { tracks: [{ clips: [clip] }] }

// create root and render new Masher with mash in props
const props = MasherDefaultProps({ edited: { mash } })
const masher = createElement(Masher, props) 
createRoot(element).render(masher)

    </script>
  </body>
</html>
```
</fieldset>

The SCRIPT first stores the DIV in the `element` variable, and then destructures what's needed from the modules. Since the UMD versions were loaded in the HEAD, we have a special variable for each module available in the global scope. 

From `React` we destructure the `createElement` function, and then the `createRoot` function from the related `ReactDOM` module. From `MovieMasherClient` we destructure the `Masher` React component and the `MasherDefaultProps` function, and then the `Icons` object from the related `MovieMasherTheme` module. 

Additionally we destructure the `TextContainerId` variable from `MovieMasher` itself, since we want to prepopluate the editor with a text clip. This is optional since the variable is just a standard string which we could hard code, but it's always nice to use the constants. 

With everything destructured, the SCRIPT then creates a text `clip` object and places it within a new `mash` object. In Movie Masher text is represented as a container, so the clip's `containerId` is set and `container.string` is populated with the desired string. By default the content appearing inside the text will simply be a color (white), but it could be an image or video as well. By default the mash `color` is black, so white text works for this example. 

The `mash` is included in arguments passed to the `MasherDefaultProps` function. This returns `props` that are then passed to the `createElement` function in order to instantiate our `Masher` component. Finally, the root is created by the `createRoot` function and our instance is passed to its `render` function. 

<!-- MAGIC:END -->

### _Please note_
This example utilizes the UMD builds of React and Movie Masher to avoid a bundling step. The appoach is simple, but potentially suboptimal since more code is being delivered than might be used in production. One simple optimization is to load the minimized builds instead, by changing React's file extensions from 'development.js' to 'production.js' and Movie Masher's from '.js' to '.min.js'. But typically a bundler converts the ESM builds into a truly optimized (tree shaken) script for final delivery. Learn more about bundling in the [Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html). 


<!-- MAGIC:START (FILEMD:src=workspaces/documentation/md/snippet/example-server.md&stripMagic=true) -->
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

### _Please note_
This example installs an FFmpeg build that has limited rendering capabilities due to lack of support of SVG files. Typically a custom build is utilized instead. Learn more about integrating your own services in the [Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html).
<!-- MAGIC:END -->


<!-- MAGIC:START (FILE:src=workspaces/documentation/md/snippet/foot.md) -->
<!-- The below content is automatically added from workspaces/documentation/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please review the [Contributor Guide](https://moviemasher.com/docs/Contributor.html) and [send an email](mailto:connect27@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
