<!-- MAGIC:START (FILE:src=dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor, encoder, and streamer - version 5.0.7_

- _visual compositing_ through **Canvas API**
- _audio mixing_ through **WebAudio API**
- _encoding_ and _streaming_ through **FFmpeg**
- _client_ implemented in **ReactJS**
- _server_ implemented in **ExpressJS**
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

## Installation

The following shell command installs the server, client, and core libraries to your NPM project,
saving them to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react @moviemasher/server-express --save
```

Alternatively, if you're wanting to build your own client and server you can just install and build off the core @moviemasher/moviemasher.js library instead.

Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-client.md&stripMagic=true) -->
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
import { ApiClient, Masher, MasherPropsDefault } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = MasherPropsDefault(applicationOptions)
const masher = <Masher {...options} />
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
[Layout Guide](https://moviemasher.com/docs/Layout.html).

<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=dev/docs/md/snippet/example-server.md&stripMagic=true) -->
## Server Example

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
[Integration Guide](https://moviemasher.com/docs/Integration.html).

<!-- MAGIC:END -->


## Docker Usage

A fully functional demo of the system including server rendering can easily be launched within Docker using the following command:

```shell
docker run -d -p '8570:8570' --name moviemasher moviemasher/moviemasher.js:5.0.7
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
