The [@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react)
package builds upon the core [@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) package to provide a suite of [ReactJS](https://reactjs.org)
components capable of displaying a video editing user interface, as well as managing file imports and metadata extraction. 

The codebase mostly follows the [Compound Components](https://www.patterns.dev/posts/compound-pattern/) React pattern, relying heavily on context to share state within a hierarchy of nested components. It deviates from the pattern by allowing arbitrary sub component naming rather than forcing dot notation. For instance, a sub component might be referenced as `ComponentSub` rather than `Component.Sub`. The drawback of this approach is that each component must be included individually, but ultimately this makes the bundler's job much easier. 

## Masher Component

The [[Masher]] top-tier component wraps the entire interface within a [[MasherContext]] that provides a pointer to the core [[Editor]] instance, theme elements, as well as state related to Drag and Drop operations. One or more second-tier components typically utilize this context to support particular editing functionality:

<!-- MAGIC:START (COLORSVG:replacements=black&src=../svg/masher.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360" class='diagram'>
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 175.37 L 0.00 175.37 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 0.00 L 640.00 0.00 L 640.00 299.97 L 460.00 299.97 Z M 460.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 228.82 0.00 L 450.00 0.00 L 450.00 175.37 L 228.82 175.37 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 185.00 L 219.76 185.00 L 219.76 360.00 L 0.00 360.00 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="14.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Player]]</text>
<text x="242.82" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Browser]]</text>
<text x="14.00" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Composer]]</text>
<text x="474.00" y="34.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Inspector]]</text>
<text x="242.82" y="219.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Timeline]]</text>
<path d="M 228.82 185.00 L 448.54 185.00 L 448.54 360.00 L 228.82 360.00 Z M 228.82 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 310.00 L 640.00 310.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 310.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<text x="474.00" y="344.48" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >[[Activity]]</text>
</svg>
<!-- MAGIC:END -->

These components also create their own contexts, providing them to lower-tier components that facilitate the user interactions that actually constitute editing. Components can access all the contexts above them in the hierarchy. For instance, the [[PlayerContent]] component first checks the `disabled` property of the [[PlayerContext]] above it before adding an `onDrop` listener. When the user actually drops a file on the component the `drop` method of the [[MasherContext]] is called in order to import the file and ultimately display it. 


<!-- MAGIC:START (FILEMD:src=../snippet/example-client-esm.md&stripMagic=true) -->
## ESM Client Example

The source code is available in ESM (ECMAScript Module) format for those wanting just a subset of functionality and an optimized build. Any of the popular bundling tools available should be able to efficiently remove (tree-shake) unused code from the build and effectively break up (code-split) the rest into easily downloadable chunks. Movie Masher has been tested extensively with [rollup.js](https://rollupjs.org/).

### Installation

The following shell command installs the client and core libraries to your NPM project, saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react --save
```

### Inclusion

From our HTML file we pull in both the compiled JavaScript and CSS files.
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

const element = document.getElementById('root')!
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


## Server Interaction

The client package is optimized to work with the [@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) package, but this is not a requirement. Server interactions are encapsulated by the [[ApiClient]] component which is typically used as the 
root component wrapping the entire application. 

When first rendered, the component makes an initial request to _/api/callbacks_ in order to configure the API itself. This endpoint can be overridden by supplying the `ApiClient` component an `endpoint` prop object:

```javascript
const clientProps = { 
  endpoint: { 
    protocol: 'http',
    host: 'localhost',
    port: 8080,
    prefix: '/api',
  },
  children: <Masher { ...props } />
}
const apiClient = <ApiClient { ...clientProps } />
```

On the server side, you'll need to add the endpoint you've specified, as described in the
[Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html#API%20Server). The response received can selectively enable other APIs.

When the [[Masher]] component is nested under an [[ApiClient]] component, it will make a [[DataDefaultRequest]] to retrieve a [[DataDefaultResponse]] to load into the editor.
When it's not, the application is still 
capable of importing and arranging media though interface elements like the save and render buttons aren't displayed. This magical behavior arises because these elements are within the [[ApiEnabled]] component which utilizes an [[ApiContext]] to control visibility of its children. This context contains an `enabled` boolean that is false by default and only enabled by the [[ApiClient]] component. When false, [[ApiEnabled]] component simply does not display its children. 

Other components use [[ApiContext]] to control visibility or augment behavior. In addition to looking at the `enabled` flag, components may inspect the context's `servers` object for a particular [[ServerType]] property that relates to their functionality. For instance, the [[Masher]] component will make a request for recent data once the ServerType.Data key is populated.  

All requests made by components are channeled through the context as well, by calling its `endpointPromise` method. This returns a fetch-based promise for a specific endpoint with support for different request methods and formats. Some components may trigger a chain of promises, depending on current state. 


