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

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/src/masher.tsx) -->

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
<!-- MAGIC:END -->
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
