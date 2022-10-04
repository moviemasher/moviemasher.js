<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/head.md -->
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

<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->


<!-- MAGIC:START (FILEMD:src=../../workspaces/documentation/md/snippet/example-client.md&stripMagic=true) -->
## Client Example

The HTML document below can simply be loaded in a web browser to display a 'hello world' example. The HEAD contains tags that load React and Movie Masher in UMD (Universal Module Definition) format directly from NPM through a CDN. The BODY contains just an empty DIV element followed by a SCRIPT that uses React to display Movie Masher, prepopulated with a text clip...

<fieldset>
<legend>umd.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher React Client</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='https://unpkg.com/react@18/umd/react.development.js' crossorigin></script>
    <script src='https://unpkg.com/react-dom@18/umd/react-dom.development.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/moviemasher.js/@5.1.0/umd/moviemasher.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/theme-default/@5.1.0/umd/theme-default.js' crossorigin></script>
    <script src='https://unpkg.com/@moviemasher/client-react.js/@5.1.0/umd/client-react.js' crossorigin></script>
    <link href='https://unpkg.com/@moviemasher/theme-default/@5.1.0/moviemasher.css' rel='stylesheet'>
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

<!-- MAGIC:START (FILEMD:src=../../workspaces/documentation/md/snippet/example-client-esm.md&stripMagic=true) -->
## ESM Client Example

The source code is available in ESM (ECMAScript Module) format for those wanting just a subset of functionality and an optimized build. Any of the popular bundling tools available should be able to efficiently remove (tree-shake) unused code from the build and effectively break up (code-split) the rest into easily downloadable chunks. Movie Masher has been tested extensively with [rollup.js](https://rollupjs.org/).

### Installation

The following shell command installs the client and core libraries to your NPM project, saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react --save
```

### Inclusion

From our HTML file we link to both the compiled JavaScript and CSS files.
To support the widest variety of workflows and tooling, the Cascading Style Sheets
required to layout the client user interface are kept separate from JavaScript code:

<fieldset>
<legend>esm.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='index.js' defer></script>
    <link href='index.css' rel='stylesheet'>
    <style>
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #root { width: 100vw; height: 100vh; display: flex; }
      .moviemasher .editor { --preview-width: 480px; --preview-height: 270px; }
    </style>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id='root' class='moviemasher'></div>
  </body>
</html>
```

</fieldset>

Since most of the interface elements scroll and stretch both horizontally and
vertically, we are rendering into a node that is styled to fill the whole window. We also apply the `moviemasher` class to the node, so the additional styles in the CSS file are engaged.

We also use this opportunity to set the dimensions of the video preview in the editor through CSS variables - to their default values, in this case. There are a few ways to override these dimensions, but doing so in the CSS is best practice.

Learn more about coloring and sizing the user interface using CSS in the
[Styling Overview](https://moviemasher.com/docs/Styling.html).

<fieldset>

<legend>masher.tsx</legend>


```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-react"

const element = document.getElementById('app')!
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
ReactDOM.createRoot(element).render(editor)
```
</fieldset>

In this example we're using the
[MasherDefaultProps](https://moviemasher.com/docs/function/MasherDefaultProps.html) function to
populate the [Masher](https://moviemasher.com/docs/component/Masher.html) component with
preconfigured children. Alternatively, child components like
[Player](https://moviemasher.com/docs/component/Player.html),
[Browser](https://moviemasher.com/docs/component/Browser.html),
[Timeline](https://moviemasher.com/docs/component/Timeline.html), and
[Inspector](https://moviemasher.com/docs/component/Inspector.html) can be
selectively provided, and manually configured with a selection of available child controls.

We are also setting the preview dimensions here, to their defaults for demonstration purposes. As mentioned above, overriding the defaults from JavaScript is sub-optimal - a visible resizing will occur as the CSS variables are updated. But perhaps helpful if supplying custom CSS is impractical.

<!-- MAGIC:END -->


Learn more about building a fully customized video editing client in the
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html).


<!-- MAGIC:START (FILE:src=../../workspaces/documentation/md/snippet/foot.md) -->
<!-- The below content is automatically added from ../../workspaces/documentation/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please review the [Contributor Guide](https://moviemasher.com/docs/Contributor.html) and [send an email](mailto:connect27@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->
