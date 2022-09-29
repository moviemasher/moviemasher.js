## Client Example

The HTML document below can simply be loaded in a web browser to display a 'hello world' example. The HEAD contains tags that load React and Movie Masher directly from NPM through a CDN. The BODY contains just an empty DIV element followed by a SCRIPT that uses React to display Movie Masher, prepopulated with a text clip...

<fieldset>
<legend>index.html</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../../packages/client-react/dev/example/index.html&stripComments=1) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher React Client</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@moviemasher/moviemasher.js/@5.1.0/umd/moviemasher.js" crossorigin></script>
    <script src="https://unpkg.com/@moviemasher/theme-default/@5.1.0/umd/theme-default.js" crossorigin></script>
    <script src="https://unpkg.com/@moviemasher/client-react.js/@5.1.0/umd/client-react.js" crossorigin></script>
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
<!-- MAGIC:END -->
</fieldset>

The SCRIPT first stores the DIV in the `element` variable, and then destructures what's needed from the modules. Since the UMD versions were loaded in the HEAD, we have a special variable for each module available in the global scope. 

From `React` we destructure the `createElement` function, and then the `createRoot` function from the related `ReactDOM` module. From `MovieMasherClient` we destructure the `Masher` React component and the `MasherDefaultProps` function, and then the `Icons` object from the related `MovieMasherTheme` module. 

Additionally we destructure the `TextContainerId` variable from `MovieMasher` itself, since we want to prepopluate the editor with a text clip. This is optional since the variable is just a standard string which we could hard code, but it's always nice to use the constants. 

With everything destructured, the SCRIPT then creates a text `clip` object and places it within a new `mash` object. In Movie Masher text is represented as a container, so the clip's `containerId` is set and `container.string` is populated with the desired string. By default the content appearing inside the text will simply be a color (white), but it could be an image or video as well. By default the mash `color` is black, so white text works for this example. 

The `mash` is included in arguments passed to the `MasherDefaultProps` function. This returns `props` that are then passed to the `createElement` function in order to instantiate our `Masher` component. Finally, the root is created by the `createRoot` function and our instance is passed to its `render` function. 

| <svg width="1rem" height="1rem" viewBox="0 0 512 512" ><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" stroke="none" fill="currentColor" /></svg> | _Please note_ |
| -- | -- |
|  | This example utilizes the UMD builds of React and Movie Masher to avoid a bundling step. The appoach is simple, but suboptimal since more code is being delivered than is actually being used in production. One simple optimization is to load the minimized UMD builds instead, by changing React's file extensions from 'development.js' to 'production.js' and Movie Masher's from '.js' to '.min.js'. But typically a bundler converts the ESM builds into a truly optimized (tree shaken) script for final delivery. Learn more about bundling in the [Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html). |