## Client Example


### Installation

The following shell command installs the client and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react --save
```

Alternatively, if you're wanting to build your own client you can just install and build off the [core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js) instead.

_Please note_ that this does not install a server implementation that interacts with this module. 
Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

### Inclusion

From our HTML file we link to both the compiled JavaScript and CSS files.
To support the widest variety of workflows and tooling, the Cascading Style Sheets
required to layout the client user interface are kept separate from JavaScript code:

<fieldset>
<legend>masher.html</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/dist/public/masher.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='masher.js' defer></script>
    <style>
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #app { width: 100vw; height: 100vh; display: flex; }
      .moviemasher .editor { --preview-width: 480px; --preview-height: 270px; }
    </style>
    <link href='masher.css' rel='stylesheet'>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id='app' class='moviemasher'></div>
  </body>
</html>
```
<!-- MAGIC:END -->
</fieldset>

Since most of the interface elements scroll and stretch both horizontally and
vertically, we are rendering into a node that is styled to fill the whole window. We also
apply the `moviemasher` class to the node, so the additional styles in the CSS file are engaged.

We also use this opportunity to set the dimensions of the video preview in the editor through CSS variables - to their default values, in this case. There are a few ways to override these dimensions, but doing so in the CSS is best practice.

Learn more about coloring and sizing the user interface using CSS in the
[Style Guide](https://moviemasher.com/docs/Style.html).

<fieldset>

<legend>masher.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/src/masher.tsx) -->

```tsx
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-react"
import "@moviemasher/theme-default/moviemasher.css"
import { Defined, DefinitionType } from '@moviemasher/moviemasher.js'

Defined.define({
  type: DefinitionType.Font,
  id: 'font.valken',
  label: 'Valken',
  source: "../shared/font/valken/valken.ttf",
  url: "../shared/font/valken/valken.woff2",
})
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
```
<!-- MAGIC:END -->
</fieldset>


, along with the `Icons` object from the theme. The later is a standard object having properties returning React icon components used in the interface. These all render as SVG elements with their `fill` attributes set to `currentColor`, so all icons ultimately display in the current text `color` inhertied from their parent element.  


In this example we're using the
[MasherDefaultProps](https://moviemasher.com/docs/function/MasherDefaultProps.html) function to
populate the [Masher](https://moviemasher.com/docs/component/Masher.html) component with
preconfigured children. Alternatively, child components like
[Player](https://moviemasher.com/docs/component/Player.html),
[Browser](https://moviemasher.com/docs/component/Browser.html),
[Timeline](https://moviemasher.com/docs/component/Timeline.html), and
[Inspector](https://moviemasher.com/docs/component/Inspector.html) can be
selectively provided, and manually configured with a selection of available child controls.

We are also setting the preview dimensions here, to their defaults for demonstration purposes. As mentioned above, overriding the defaults from JavaScript is sub-optimal - a visible resizing will occur as the CSS variables are updated - but helpful if supplying custom CSS is impractical.

Learn more about building a fully customized video editing client in the
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html).