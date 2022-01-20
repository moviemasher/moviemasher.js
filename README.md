[![Image](dev/img/logo.png "Movie Masher")](https://moviemasher.com)

---

_Browser based video and audio editor - version 5.0.0_

- **visual composition** with transformations!
- **audio mixing** utilizing WebAudio
- **undo/redo** history and commands
- **framework** for custom effects, titles and transitions

## Documentation

## Installation

---

The following shell command installs the server, client, and core libraries to your NPM project,
saving them to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-node --save
```

## Usage

---

In our HTML file we link to our compiled JavaScript and CSS files.
Since most of interface elements scroll both horizontally and
vertically, the Masher is also typically rendered into a node
that is styled to fill the whole window.

<fieldset>
<legend>index.html</legend>
<!-- MAGIC:START (TRIMCODE:src=dev/workspaces/example-react/dist/index.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='index.js' defer></script>
    <link href='index.css' rel='stylesheet'>
    <style>
      body {
        margin: 0px;
        padding: 0px;
        font-family: sans-serif;
      }
      body, #app {
        width: 100vw;
        height: 100vh;
        display: flex;
      }
    </style>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id='app' class='moviemasher'></div>
  </body>
</html>
```
<!-- MAGIC:END -->
</fieldset>

Within our code we render the editor, and can optionally define media assets that will
appear within the Browser Panel. Several Themes and Effects are predefined, as
well as a single Font - but no Images, Video, or Audio will appear in the Browser by default.

<fieldset>

<legend>index.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/workspaces/example-react/index.tsx) -->

```tsx
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Factory } from "@moviemasher/moviemasher.js"
import {
  MasherDefaults, Masher, RemixIcons
} from "@moviemasher/client-react"

import "@moviemasher/client-react/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Soundtrack", id: "id-audio",
  url: "assets/soundtrack.mp3", duration: 180,
})

Factory.video.install({
  label: "Video", id: "id-video",
  url: 'assets/video.mp4',
  duration: 3, fps: 10,
})

const options = { icons: RemixIcons }
const editor = <Masher {...MasherDefaults(options)} />
const mode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
```
<!-- MAGIC:END -->
</fieldset>

## Feedback

If any problems arise while utilizing this repository, a [GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.

## Contributing

The following command will copy the entire Git project to your local machine, complete with examples, tests, and documentation:

```shell
git clone https://github.com/moviemasher/moviemasher.js.git
```

Please join in the shareable economy by gifting your efforts towards improving this project in any way you feel inclined. Pull requests for fixes, features and refactorings are always appreciated, as are documentation updates. Creative help with graphics, video and the web site is also needed. Please contact through [MovieMasher.com](https://moviemasher.com) to discuss your ideas, or donate to the project.

#### Developer Setup

Due to the security mechanisms used, this project can only be viewed in a web browser if delivered through a web server - simply viewing index.html locally in a browser will not work. If you are not running a web server on your local machine, [Docker](http://docker.com) is a safe and recommended way to do so. Once installed and running, `cd` into the _config/docker/development_ directory and:

- execute `docker-compose up -d` to launch apache web server
- load [http://localhost:8090/app](http://localhost:8090/app) in a web browser
- execute `docker-compose down -v` to terminate apache web server

[Docker](http://docker.com) is required for working on the project itself. Once installed and running, `cd` into the _config/docker/node_ directory and:

- execute `docker-compose run --rm npm` to update node modules
- execute `docker-compose run --rm grunt` to rebuild JavaScript files

#### Known issues in this version

- new convolution filter is very beta - does not always match ffmpeg output
- little documentation - see angular-moviemasher for usage and moviemasher.rb for mash syntax
- video file playback not yet supported - they must be converted to image sequences and MP3 soundtracks
- audio filters not yet supported
