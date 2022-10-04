The [@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react)
package builds upon the core [@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) package to provide a suite of [ReactJS](https://reactjs.org)
components capable of displaying a video editing user interface, as well as managing file imports and metadata extraction. 


<!-- MAGIC:START (FILEMD:src=../snippet/example-client-esm.md&stripMagic=true) -->
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

## Layout

Laying out a Movie Masher client application involves creating a tagging structure that properly
nests components within a functional hierarchy. A given child component may have to be
positioned under a particular parent component in order to access the context it needs
to fully function.


## Server Interaction

The client package is optimized to work with the [@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) package, but this is not a requirement. Server interactions are encapsulated by the [[ApiClient]] component which is typically used as the 
root component wrapping the entire application. Without this component the application is still 
capable of importing and arranging media, though interface elements like the save and render buttons aren't displayed. 

This magical behavior arises because these elements are within the [[ApiEnabled]] component which utilizes an [[ApiContext]] to control visibility of its children. This context contains an `enabled` boolean that is false by default and only enabled by the [[ApiClient]] component. When false, [[ApiEnabled]] component simply does not display its children. 

Other components use [[ApiContext]] to control visibility or augment behavior. In addition to looking at the `enabled` flag, components may inspect the context's `servers` object for a particular [[ServerType]] property that relates to their functionality. For instance, the [[Masher]] component will make a request for recent data once the ServerType.Data key is populated.  

All requests made by components are channeled through the context as well, by calling its `endpointPromise` method. This returns a fetch-based promise for a specific endpoint with support for different request methods and formats. Some components may trigger a chain of promises, depending on current state. 

## Masher

The [[Masher]] component can be the root component or placed under an [[ApiClient]] component. When under an [[ApiClient]] component, it will make a [[DataDefaultRequest]] to retrieve a
a [[DataDefaultResponse]] to load into the editor.
It supplies a [[MasherContext]] to its children which simply contains a
`editor` reference to the underlying [[Editor]].
The user interface presented on the [Demo](demo/index.html) page uses the
[[MasherDefaultProps]] method to suppy default props to this component.
It supplies the following children:

<!-- MAGIC:START (COLORSVG:replacements=black&src=../../svg/masher.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360" class='diagram'>
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 175.37 L 0.00 175.37 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 0.00 L 640.00 0.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 228.82 0.00 L 450.00 0.00 L 450.00 175.37 L 228.82 175.37 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 185.00 L 450.00 185.00 L 450.00 360.00 L 0.00 360.00 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="21.66" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Player]]</text>
<text x="249.84" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Browser]]</text>
<text x="21.20" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Timeline]]</text>
<text x="480.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Inspector]]</text>
</svg>
<!-- MAGIC:END -->
