<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, and streamer - version 5.0.7_

- _visual compositing_ through **Canvas API**
- _audio mixing_ through **WebAudio API**
- _encoding_ and _streaming_ through **FFmpeg**
- _client_ implemented in **ReactJS**
- _server_ implemented in **ExpressJS**
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

<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
[more extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

## Installation

The following shell command installs the client and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react --save
```

_Please note_ that this does not install a server implementation that interacts with this module.
Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

<!-- MAGIC:START (FILEMD:src=../../dev/docs/md/snippet/example-client.md&stripMagic=true) -->
## Client Example

From our HTML file we link to both the compiled JavaScript and CSS files.
To support the widest variety of workflows and tooling, the Cascading Style Sheets
required to layout the client user interface are kept separate from JavaScript code:

<fieldset>
<legend>masher.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='masher.js' defer></script>
    <link href='masher.css' rel='stylesheet'>
    <style>
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #app { width: 100vw; height: 100vh; display: flex; }
      .moviemasher .editor { --preview-width: 480px; --preview-height: 270px; }
    </style>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id='app' class='moviemasher'></div>
  </body>
</html>
```
</fieldset>

Since most of the interface elements scroll and stretch both horizontally and
vertically, we are rendering into a node that is styled to fill the whole window. We also
apply the `moviemasher` class to the node, so the additional styles in the CSS file are engaged.

We also use this opportunity to set the dimensions of the video preview in the editor through CSS variables - to their default values, in this case. There are a few ways to override these dimensions, but doing so in the CSS is best practice.

Learn more about coloring and sizing the user interface using CSS in the
[Style Guide](https://moviemasher.com/docs/Style.html).

<fieldset>

<legend>masher.tsx</legend>


```tsx
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ApiClient, Masher, DefaultMasherProps } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = DefaultMasherProps(applicationOptions)
const masher = <Masher {...options} />
const editor = <ApiClient>{masher}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
```
</fieldset>

In this example we're using the
[DefaultMasherProps](https://moviemasher.com/docs/function/DefaultMasherProps.html) function to
populate the [Masher](https://moviemasher.com/docs/component/Masher.html) component with
preconfigured children. Alternatively, child components like
[Player](https://moviemasher.com/docs/component/Player.html),
[Browser](https://moviemasher.com/docs/component/Browser.html),
[Timeline](https://moviemasher.com/docs/component/Timeline.html), and
[Inspector](https://moviemasher.com/docs/component/Inspector.html) can be
selectively provided, and manually configured with a selection of available child controls.

We are also setting the preview dimensions here, to their defaults for demonstration purposes. As mentioned above, overriding the defaults from JavaScript is sub-optimal - a visible resizing will occur as the CSS variables are updated - but helpful if supplying custom CSS is impractical.

Learn more about building a fully customized video editing client in the
[Layout Guide](https://moviemasher.com/docs/Layout.html).

<!-- MAGIC:END -->
<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/foot.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect27@moviemasher.com)
to discuss ways to contribute to the project.
<!-- MAGIC:END -->
