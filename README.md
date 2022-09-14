<!-- MAGIC:START (FILE:src=dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

| JavaScript video editor, encoder, switcher | _NEW in version 5.1.0_ |
| -- | -- |
| **visual compositing** through _SVG API_ <br> **audio mixing** through _WebAudio API_ <br> **client** implemented in _ReactJS_ <br> **server** implemented in _ExpressJS_  <br> **encode** and **stream** through _FFmpeg_ | • container/content pattern <br> • vector-based masking <br> • tranform/color tweening <br> • WYSIWYG player editing <br> • reorganized inspector |
<!-- MAGIC:END -->

<!-- MAGIC:START (FILE:src=dev/docs/md/snippet/documentation.md) -->
<!-- The below content is automatically added from dev/docs/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
[more extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

## Availability

Movie Masher is offered through a variety of popular platforms. The entire
[repository](https://github.com/moviemasher/moviemasher.js)
can of course be cloned or forked from Github. The
[core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js)
can be installed through NPM, as can the
[client](https://www.npmjs.com/package/@moviemasher/client-react) and
[server](https://www.npmjs.com/package/@moviemasher/server-express)
add-ons. The
[image](https://hub.docker.com/r/moviemasher/moviemasher.js/) in DockerHub
combines these into a fully functional application for running locally.
And the
[image](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6)
in AWS Marketplace does the same within their hosted environment.

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-core.md&stripMagic=true) -->
## Core Example

The HTML document below can simply be loaded in a web browser to display the simplest 'hello world' example. The SCRIPT tag within the HEAD tag loads the latest version of the core library directly from NPM through a CDN. The BODY contains just an empty SVG tag followed by another SCRIPT tag containing code that uses the library to populate it with SVGElements. 

<fieldset>
<legend>moviemasher.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src="https://unpkg.com/@moviemasher/moviemasher.js/dist/moviemasher.js" crossorigin></script>
  </head>
  <body>
    <svg id="svg" width="640" height="480"></svg>
    <script>

const svg = document.getElementById('svg')
const { editorInstance, ContainerTextId } = MovieMasher
const editor = editorInstance({ rect: svg.getBoundingClientRect() })
const clip = { 
  container: { string: 'Hello World!' }, containerId: ContainerTextId
}
editor.load({ mash: { tracks: [{ clips: [clip] }] } }).then(() => {
  editor.svgItems().then(svgs => svg.append(...svgs))
})
 
    </script>
  </body>
</html>
```
</fieldset>

The SCRIPT first stores the SVG element in the `svg` variable and then destructures what's needed from the core library. The `editorInstance` method is used to construct an editor, which is a specialized object capable of loading and previewing an 'edit decision list'. The SVG's bounding rect is provided to the editor so it knows how big a preview to generate. 

This example includes just a single text clip on a single track, but multiple tracks containing multiple clips of different types could be provided. In Movie Masher, text is a kind of container so we specify `ContainerTextId` as the clip's `containerId` and populate `container` with the `string` we want to display. 

This clip is then nested within a mash object which is passed to the editor's `load` method. This returns a promise that resolves once the first frame can be displayed, in this case waiting until the default font is loaded. 

The editor's `svgItems` method is then called which returns another promise that resolves with an array of elements. These are simply then appended to our SVG tag. 

_Please note_ that this example will only display what's on the first frame of our mash and will not update if we subsequently use the editor to make changes. Its utility is limited to displaying a mash at a particular time. 



Learn more about building a fully customized video editing client in the
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html).

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-client.md&stripMagic=true) -->
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
import { ApiClient, Masher, MasherPropsDefault } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"
import { Defined, DefinitionType } from '@moviemasher/moviemasher.js'

Defined.define({
  type: DefinitionType.Font,
  id: 'font.valken',
  label: 'Valken',
  source: "../shared/font/valken/valken.ttf",
  url: "../shared/font/valken/valken.woff2",
})
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherPropsDefault(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
```
</fieldset>

In this example we're using the
[MasherPropsDefault](https://moviemasher.com/docs/function/MasherPropsDefault.html) function to
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

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-client.md&stripMagic=true) -->
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
import { ApiClient, Masher, MasherPropsDefault } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"
import { Defined, DefinitionType } from '@moviemasher/moviemasher.js'

Defined.define({
  type: DefinitionType.Font,
  id: 'font.valken',
  label: 'Valken',
  source: "../shared/font/valken/valken.ttf",
  url: "../shared/font/valken/valken.woff2",
})
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherPropsDefault(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
```
</fieldset>

In this example we're using the
[MasherPropsDefault](https://moviemasher.com/docs/function/MasherPropsDefault.html) function to
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

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-server.md&stripMagic=true) -->
## Server Example

### Installation

The following shell command installs the server and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```
Alternatively, if you're wanting to build your own server you can just install and build off the [core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js) instead.

_Please note_ that this does not install a client implementation that interacts with this module.
Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

### Inclusion
<fieldset>

<legend>server.ts</legend>


```ts
import path from 'path'
import { Host, DefaultHostOptions, expandToJson } from '@moviemasher/server-express'

const configuration = process.argv[2] || path.resolve(__dirname, './server-config.json')
const options = expandToJson(configuration)
const host = new Host(DefaultHostOptions(options))
host.start()
```
</fieldset>

In this example we're using the
[DefaultHostOptions](https://moviemasher.com/docs/function/DefaultHostOptions.html) function to
create the [Host](https://moviemasher.com/docs/component/Host.html) constructor arguments from a JSON file with the following structure:

<fieldset>

<legend>server-config.json</legend>


```json
{
  "port": 8570,
  "previewSize": { "width": 480, "height": 270 },
  "outputSize": { "width": 1920, "height": 1080 }
}
```
</fieldset>

We are setting the preview dimensions to their default for demonstration purposes. The server will pass these to the client and the client will apply them, but only after the CSS is applied so a resize will be visible if they differ. Preview dimensions should be overridden either in the client, or better still, in the CSS. If the defaults are overidden there they should be here too, since the client does NOT pass them to the server. The rendering server uses them to optimally size previews of uploaded video and images.

We are also setting the output dimensions here, which are used as default values for both the rendering and streaming servers. Please note: they should always be an even multiple of the preview dimensions - in this case it's a multiple of four. Using different aspect ratios is actually supported, but then the preview in the client will not match the output of these servers.

Learn more about building your own customized server in the
[Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html).

<!-- MAGIC:END -->


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

The _dev/image/docker-compose.yml_ file provides some other options to explore and is used by the `docker-up` and `docker-down` npm scripts.

## Development

The following Git command will copy the entire Git project to your local machine,
complete with examples, tests, and documentation:

```shell
git clone https://github.com/moviemasher/moviemasher.js.git
```

The following NPM commands can be executed to install all needed dependencies, build
JavaScript from the TypeScript codebase, and launch a local development server:

```shell
npm install
npm run build
npm start
```

You can then load Movie Masher by navigating your web browser to
[http://localhost:8570](http://localhost:8570) and supplying any username/password
combination when prompted. When you're done exploring, execute the follow command to stop the server and clean up:

```shell
npm install
npm run build
npm run stop
```

<!-- MAGIC:START (FILE:src=dev/docs/md/snippet/foot.md) -->
<!-- The below content is automatically added from dev/docs/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect27@moviemasher.com)
to discuss ways to contribute to the project.
<!-- MAGIC:END -->
