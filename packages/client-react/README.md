<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/head.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, switcher_
- _visual compositing_ through **SVG API**
- _audio mixing_ through **WebAudio API** 
- _client_ implemented in **ReactJS** 
- _server_ implemented in **ExpressJS**  
- _encode_ and _stream_ through **FFmpeg**
<!-- MAGIC:END -->

## React Client Plug-in

This module is a
[ReactJS](https://reactjs.org)
reference implementation of a client plug-in that utilizes the core
[@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js)
module.

It exports component functions, contexts, hooks, utility methods, and styles
that manifest a video editing user interface and interact with a server implementation like
[@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express). Its imports are all specified as peer dependencies.

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=../../workspaces/documentation/src/snippet/example-client.md&stripMagic=true) -->
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
    <script src='https://unpkg.com/@moviemasher/moviemasher.js@5.1.1/umd/moviemasher.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/theme-default@5.1.1/umd/theme-default.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/client-react@5.1.1/umd/client-react.js' crossorigin></script>
    <link href='https://unpkg.com/@moviemasher/theme-default@5.1.1/moviemasher.css' rel='stylesheet'>
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


Learn more about building a fully customized video editing client in the
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html).


<!-- MAGIC:START (FILE:src=../../workspaces/documentation/src/snippet/foot.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/src/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please review the [Contributor Guide](https://moviemasher.com/docs/Contributor.html) and [send an email](mailto:connect27@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
