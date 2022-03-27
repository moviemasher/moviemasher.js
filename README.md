[![Image](./dev/img/moviemasher.svg "Movie Masher")](http://moviemasher.com)

_JavaScript video editor, encoder, and streamer - version 5.0.0_

- **visual compositing** through Canvas API
- **audio mixing** through WebAudio API
- **encoding** and **streaming** through FFmpeg

## Availability

Movie Masher is offered through a variety of popular platforms. The entire
[moviemasher/moviemasher.js](https://github.com/moviemasher/moviemasher.js)
project repository can of course be cloned or forked from Github. The core
[@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) library can be installed through NPM, as can the
[@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) and
[@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express)
add-ons. The
[moviemasher/moviemasher.js](https://hub.docker.com/r/moviemasher/moviemasher.js/)
Docker image combines these into a fully functional application for running locally.
And the
[Movie Masher AMI](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6)
in the AWS Marketplace does the same within their hosted environment.

## Documentation

In addition to this README, there is a simple
[Demo](https://moviemasher.com/docs/demo/index.html) of the system and
[more extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.

## Installation

The following shell command installs the server, client, and core libraries to your NPM project,
saving them to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/client-react @moviemasher/server-express --save
```

## Inclusion

From your HTML file link to both the compiled JavaScript and CSS files.
To support the widest variety of workflows and tooling, the Cascading Style Sheets
required to layout the client user interface are kept separate from JavaScript code:

<fieldset>
<legend>index.html</legend>
<!-- MAGIC:START (TRIMCODE:src=workspaces/example-react/dist/index.html) -->

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="index.js" defer></script>
    <link href="index.css" rel="stylesheet" />
    <style>
      body {
        margin: 0px;
        padding: 0px;
        font-family: sans-serif;
      }
      body,
      #app {
        width: 100vw;
        height: 100vh;
        display: flex;
      }
    </style>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id="app" class="moviemasher"></div>
  </body>
</html>
```

<!-- MAGIC:END -->
</fieldset>

Since most of the interface elements scroll and stretch both horizontally and
vertically, we are rendering into a node that is styled to fill the whole window. We also
apply the `moviemasher` class to the node, so the additional styles in the CSS file are engaged.
Learn more about coloring and sizing the user interface using CSS in the
[Style Guide](https://moviemasher.com/docs/Style.html).

## Usage

Within our JavaScript code we render the editor, and can optionally define media assets that will
appear within the Browser. Several Themes and Effects are predefined, as
well as a single Font - but no Images, Video, or Audio will appear in the Browser by default.

<fieldset>

<legend>index.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=workspaces/example-react/index.tsx) -->

```tsx
import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import {
  DefaultIcons,
  Masher,
  MasherDefault,
  MasherDefaultOptions,
} from "@moviemasher/client-react";

import "@moviemasher/client-react/dist/moviemasher.css";

const options: MasherDefaultOptions = { icons: DefaultIcons };
const masher = <Masher {...MasherDefault(options)} />;
const mode = <StrictMode>{masher}</StrictMode>;
ReactDOM.render(mode, document.getElementById("app"));
```

<!-- MAGIC:END -->
</fieldset>

In this example we're using the
[MasherDefault](https://moviemasher.com/docs/function/MasherDefault.html) function to
populate the [Masher](https://moviemasher.com/docs/component/Masher.html) component with
preconfigured children, utilizing icons specified in the
[DefaultIcons](https://moviemasher.com/docs/variable/DefaultIcons.html) object.

Alternatively, child components like
[Player](https://moviemasher.com/docs/component/Player.html),
[Browser](https://moviemasher.com/docs/component/Browser.html),
[Timeline](https://moviemasher.com/docs/component/Timeline.html), and
[Inspector](https://moviemasher.com/docs/component/Inspector.html) can be
selectively provided, and manually configured with a selection of available child controls.
Learn more about building a fully customized video application in the
[Layout Guide](https://moviemasher.com/docs/Layout.html).

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
combination when prompted. Learn more about building your own customized server in the
[Integration Guide](https://moviemasher.com/docs/Integration.html).

## Contributing

Please join in the shareable economy by gifting your efforts towards improving this
project in any way you feel inclined. Pull requests for fixes, features and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed - please [send an email](mailto:connect27@moviemasher.com)
to discuss your ideas.

## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally provided to particular projects on an hourly basis - please
[send an email](mailto:connect27@moviemasher.com) describing your intended usage.
