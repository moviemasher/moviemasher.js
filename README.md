[![Image](dev/assets/moviemasher-logo.png 'Movie Masher')](https://moviemasher.com)

---

_Browser based video and audio editor - version 5.0.0_

- **visual composition** with transformations
- **audio mixing** utilizing WebAudio
- **undo/redo** history and commands
- **framework** for custom effects, titles and transitions

## Installation

---

The following shell command installs the library to your NPM project, saving the current version number to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/react-moviemasher --save
```

## Usage

---

In our HTML file we link to our compiled JavaScript and CSS files.
Since most of interface elements scroll both horizontally and
vertically, the Editor is also typically rendered into a node
that is styled to fill the whole window.

<fieldset>
<legend>index.html</legend>
<!-- MAGIC:START (TRIMCODE:src=dev//workspaces/client/dist/index.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link href='moviemasher.css' rel='stylesheet'>
    <script src='index.js' defer></script>
    <style>
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #app { width: 100vw; height: 100vh; display: flex; }
    </style>
    <title>Movie Masher</title>
  </head>
  <body>
    <div id='app'></div>
  </body>
</html>
```
<!-- MAGIC:END -->
</fieldset>

Within our code we render the editor, and can optionally define media assets that will
appear within the Browser Panel. Several Themes and Effects are predefined, as
well as a single Font - but no Images, Video, or Audio will appear in the Browser by default.

<fieldset>
<legend>basic.jsx</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/workspaces/client/basic.jsx) -->

```jsx
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ReactMovieMasher, RemixIcons, DefaultInputs } from "@moviemasher/react-moviemasher"
import { Factory } from "@moviemasher/moviemasher.js"

import "@moviemasher/react-moviemasher/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "assets/raw/monster-mash.mp3", duration: 180,
})

Factory.video.install({
  label: "Video", id: "id-video", url: 'assets/raw/timing.mp4',
  duration: 3, fps: 10,
})

Factory.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/raw/BlackoutTwoAM.ttf",
})

const applicationOptions = {
  icons: RemixIcons,
  inputs: DefaultInputs,
}

const application = <ReactMovieMasher {...applicationOptions} />

ReactDOM.render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
```
<!-- MAGIC:END -->
</fieldset>

## Styling

---

Modern CSS techniques like flexbox, grid, and variables provide a relatively simple means to powerfully affect the graphical appearance of the Editor. If only a few changes are needed, it's easiest to just redefine select styles from the _moviemasher.css_ file we included in _index.html_ above. This file is a concatenation of the other files within that directory, shown below. An alternative approach for more elaborate changes would be to replace one or more of these files and include them individually.

<details>
<summary>Coloring</summary>

Blah...

<fieldset>
<legend>colors.css</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/css/colors.css&stripComments=1) -->

```css
.moviemasher-app {
  --moviemasher-back-primary: hsl(0, 0%, 20%);
  --moviemasher-back-secondary: hsl(0, 0%, 15%);
  --moviemasher-back-tertiary: hsl(0, 0%, 10%);
  --moviemasher-fore-primary: #ababab;
  --moviemasher-fore-secondary: #cfcfcf;
  --moviemasher-fore-tertiary: #e9e9e9;
  --moviemasher-color: #758caa;
  --moviemasher-color-pop: #a2c3ee;
  --moviemasher-color-mute: #476780;
}

@media (prefers-color-scheme: light) {
  .moviemasher-app {
    --moviemasher-back-primary: hsl(0, 0%, 97%);
    --moviemasher-back-secondary: hsl(0, 0%, 92%);
    --moviemasher-back-tertiary: hsl(0, 0%, 88%);
    --moviemasher-fore-primary: #1d1d1d;
    --moviemasher-fore-secondary: #2c2c2c;
    --moviemasher-fore-tertiary: #545454;
    
  }
}
```
<!-- MAGIC:END -->
</fieldset>
</details>

<details>
<summary>Sizing</summary>

Blah...

<fieldset>
<legend>dimensions.css</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/css/dimensions.css&stripComments=1) -->

```css
.moviemasher-app {
  --padding: 40px;
  --spacing: 20px;
  --header-height: 38px;
  --footer-height: 48px;

  --moviemasher-border-size: 1px;
  --moviemasher-border-radius: calc(5 * var(--moviemasher-border-size));
  --moviemasher-width-preview: 480px;
  --moviemasher-height-preview: 270px;
  --moviemasher-height-scrub: 16px;
  --moviemasher-width-inspector: 240px;
  --moviemasher-width-track: 34px;
  --moviemasher-height-track: 84px;
  --moviemasher-icon-size: 24px;
  --moviemasher-button-size: 24px;
  --moviemasher-border: var(--moviemasher-border-size) solid var(--moviemasher-fore-primary);
}

.moviemasher-content {
  --padding: 20px;
  --spacing: 10px;
}

.moviemasher-foot,
.moviemasher-head {
  --padding: 5px;
  --spacing: 5px;
}
```
<!-- MAGIC:END -->
</fieldset>
</details>

<details>
<summary>Positioning</summary>

Blah...

<fieldset>
<legend>layout.css</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/css/layout.css&stripComments=1) -->

```css
.moviemasher-app * { box-sizing: border-box; }

.moviemasher-app {
  width: 100%;
  display: grid;
  grid-template-areas:
    "player browser inspector"
    "timeline timeline inspector";
  grid-column-gap: var(--spacing);
  grid-row-gap: var(--spacing);
  grid-template-columns:
    calc(
      var(--moviemasher-width-preview)
      + (var(--moviemasher-border-size) * 2)
    )
    1fr
    var(--moviemasher-width-inspector);
  grid-template-rows:
    calc(
      var(--moviemasher-height-preview)
      + var(--header-height)
      + var(--footer-height)
    )
    1fr;
  padding: var(--padding);
  background-color: var(--moviemasher-back-primary);
  color: var(--moviemasher-fore-tertiary);
}

.moviemasher-panel {
  overflow: hidden;
  display: grid;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  grid-template-columns: 1fr;
  border: var(--moviemasher-border);
  border-radius: var(--moviemasher-border-radius);
  background-color: var(--moviemasher-back-secondary);
}

.moviemasher-head {
  border-bottom: var(--moviemasher-border);
  padding: var(--padding);
  column-gap: var(--spacing);
}

.moviemasher-foot {
  border-top: var(--moviemasher-border);
  padding: var(--padding);
  column-gap: var(--spacing);
}

.moviemasher-foot,
.moviemasher-head {
  background-color: var(--moviemasher-back-tertiary);
  display: grid;
}

.moviemasher-head > *,
.moviemasher-foot > * {
  margin-block: auto;
}

.moviemasher-app button:hover {
  color: var(--moviemasher-color-pop);
  border-color: var(--moviemasher-color-pop);
}

.moviemasher-app button,
.moviemasher-app button:disabled {
  display: inline-flex;
  min-width: var(--moviemasher-icon-size);
  height: var(--moviemasher-icon-size);
  cursor: pointer;
  appearance: none;
  outline: none;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  border: var(--moviemasher-border);
  border-radius: var(--moviemasher-border-radius);
  border: 1px solid var(--moviemasher-color-mute);
  border-radius: 4px;
  color: var(--moviemasher-color-mute);
  background-color: var(--moviemasher-back-tertiary);
}

.moviemasher-app button:disabled {
  background-color: var(--moviemasher-back-secondary);
  color: var(--moviemasher-back-primary);
  border-color: var(--moviemasher-back-primary);
}


.moviemasher-app button > svg {
  width: 0.75rem;
  height: 0.75rem;
  margin: 0px 5px;
}

.moviemasher-selected {
  color: var(--moviemasher-color-pop);
  border-color: var(--moviemasher-color-pop);
}

.moviemasher-selected:hover {
  color: var(--moviemasher-color-mute);
  border-color: var(--moviemasher-color-mute);
}


.moviemasher-drop {
  background-color: var(--moviemasher-color-pop);
}

.moviemasher-browser {
  grid-area: browser;
}

.moviemasher-browser .moviemasher-head {
  grid-template-columns: repeat(auto-fit, var(--moviemasher-icon-size));
  overflow: hidden;
}

.moviemasher-browser .moviemasher-content {
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(var(--moviemasher-width-preview) / 3));
  grid-auto-rows: calc(var(--moviemasher-height-preview) / 3);
  gap: var(--spacing);
  overflow-y: auto;
}


.moviemasher-inspector {
  grid-area: inspector;
}
.moviemasher-inspector label {
  text-transform: capitalize;

}
.moviemasher-inspector label::after {
  content: ': ';
}

.moviemasher-inspector .moviemasher-content {
  overflow-y: auto;
  padding: var(--padding);
}

.moviemasher-inspector .moviemasher-content > * {
  margin-bottom: var(--spacing);
}

.moviemasher-input {
  width: 100%;

}

.moviemasher-input input {
  width: 100%;
}

.moviemasher-timeline {
  isolation: isolate;
  grid-area: timeline;
}

.moviemasher-timeline .moviemasher-head {
  grid-template-columns: repeat(9, auto) 1fr;
}

.moviemasher-timeline .moviemasher-content {
  position: relative;
  overflow: auto;
  display: grid;
  grid-template-areas: "scrubber-icon scrubber" "tracks-icon tracks";
  grid-template-columns: var(--moviemasher-width-track) 1fr;
  grid-template-rows: var(--moviemasher-height-scrub) 1fr;
}

.moviemasher-scrub-pad,
.moviemasher-scrub {
  background-color: var(--moviemasher-back-secondary);
  border-bottom: var(--moviemasher-border);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
.moviemasher-scrub-pad {
  grid-area: scrubber-icon;
  z-index: 2;
}
.moviemasher-scrub {
  grid-area: scrubber;
  z-index: 3;
}

.moviemasher-scrub-bar-container {
  pointer-events: none;
  position: relative;
  grid-area: tracks;
}

.moviemasher-scrub-bar {
  position: absolute;
  width: 1px;
  top: 0px;
  bottom: 0px;
  background-color:var(--moviemasher-color);
}
.moviemasher-scrub-icon {
  margin-left: calc(0px - (var(--moviemasher-height-scrub) / 2));
  position: absolute;
  background-color: var(--moviemasher-color);
  width: var(--moviemasher-height-scrub);
  height: var(--moviemasher-height-scrub);
  clip-path: polygon(3px 3px, calc(100% - 3px) 3px, 50% calc(100% - 3px));
}


.moviemasher-tracks {
  grid-area: tracks;
  grid-column-start: tracks-icon;
}

.moviemasher-timeline .moviemasher-foot {
  grid-template-columns: 50% repeat(auto-fill, var(--moviemasher-button-size));
}

.moviemasher-timeline-sizer {
  pointer-events: none;
  position: absolute;
  left: var(--moviemasher-width-track);
  right: 0px;
  top: var(--moviemasher-height-scrub);
  bottom: 0px;
}


.moviemasher-track {
  display: grid;
  grid-template-columns: var(--moviemasher-width-track) 1fr;
  border-bottom: var(--moviemasher-border);
  height: var(--moviemasher-height-track);
  overflow-y: hidden;
}

.moviemasher-track-icon {
  background-color: var(--moviemasher-back-tertiary);

  position: -webkit-sticky;
  position: sticky;
  left: 0;
}

.moviemasher-track-icon {
  display: grid;
}

.moviemasher-track-icon svg {
  margin: auto;
}

.moviemasher-clips {
  white-space: nowrap;
  margin-block: auto;
}

.moviemasher-clips,
.moviemasher-clip {
  height: calc(var(--moviemasher-height-track) - (2 * var(--padding)));
}

.moviemasher-definition,
.moviemasher-clip {
  display: inline-flex;
  background-color: var(--moviemasher-back-tertiary);
  border: var(--moviemasher-border);
  border-radius: var(--moviemasher-border-radius);
}

.moviemasher-clip {
  overflow-x: hidden;
  padding: 0px;
}

.moviemasher-clip label:after,
.moviemasher-definition label:after {
  content: var(--clip-label);
}

.moviemasher-app .MuiSvgIcon-root {
  font-size: var(--moviemasher-icon-size);
}

.moviemasher-scrub .MuiSvgIcon-root {
  font-size: var(--moviemasher-height-scrub);
}
.moviemasher-app .MuiSlider-root {
  color: var(--moviemasher-color-mute);
  padding: 11px;
}


.moviemasher-player {
  grid-area: player;
}

.moviemasher-player .moviemasher-foot {
  grid-template-columns: var(--moviemasher-icon-size) 1fr 1fr;
}

.moviemasher-player .moviemasher-content {
  background: repeating-conic-gradient(
    var(--moviemasher-back-primary) 0% 25%, transparent 0% 50%
  ) 50% / 20px 20px;
  background-position: top left;
  width: var(--moviemasher-width-preview);
  height: var(--moviemasher-height-preview);
}
```
<!-- MAGIC:END -->
</fieldset>
</details>

## Icons

---

<fieldset>
<legend>RemixIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=packages/react-moviemasher/src/Components/Editor/EditorIcons/RemixIcons.tsx&stripImports=1&stripExports=1) -->

```tsx
const RemixIcons: EditorIcons = {
  browserAudio: <Music2FillIcon />,
  browserEffect: <FolderSettingsFillIcon />,
  browserImage: <ImageFillIcon />,
  browserTheme: <FolderChartFillIcon />,
  browserTransition: <FolderTransferFillIcon />,
  browserVideo: <FilmFillIcon />,
  browserVideoStream: <VideoChatFillIcon />,
  browserAudioStream: <ChatVoiceFillIcon />,
  playerPause: <PauseCircleFillIcon />,
  playerPlay: <PlayCircleFillIcon />,
  timelineAddTransition: <SwapBoxLineIcon />,
  timelineAddAudio: <MvLineIcon />,
  timelineAddVideo: <VideoLineIcon />,
  timelineTrackTransition: <ArrowLeftRightLineIcon />,
  timelineTrackAudio: <MusicLineIcon />,
  timelineTrackVideo: <ArrowRightSLineIcon />,
  upload: <UploadCloud2LineIcon />,
  undo: <ArrowGoBackLineIcon />,
  redo: <ArrowGoForwardLineIcon />,
  remove: <DeleteBin7LineIcon />,
  split: <SplitCellsHorizontalIcon />,
}
```
<!-- MAGIC:END -->
</fieldset>

## Servers

---

- static: delivers js, css
- configuration: gets addresses of other servers
- crud: saves mashes, triggers jobs
- renderer: transcodes mash into raw media files (videos, images, audio, sequences)
- streamer: builds stream out of mash
- webrtc to rtmp: turns webcam output into RTMP stream
- rtmp to hls: turns rtmp stream into hls stream

## Customization

---

- Editor
  - PlayerPanel
    - PlayerContent
    - PlayButton
      - Playing
      - Paused
    - TimeSlider
    - VolumeSlider
    - MuteButton
  - BrowserPanel (Browser)
    - BrowserContent
    - BrowserSource
  - TimelinePanel (TimelinePanel)
    - ScrubControl (Scrubber)
    - ScrubElement (ScrubberElement)
    - ScrubArea (TimelineSizer)
    - Zoomer
    - Tracks (TimelineTracks)
      - TrackAudio
      - TrackVideo
      - TrackMain
      - Clips (TimelineClips)
  - InspectorPanel
    - SelectionType
    - SelectionId

Blah...

<fieldset>
<legend>ReactMovieMasher JSX</legend>

<!-- MAGIC:START (TRIMCODE:src=packages/react-moviemasher/src/Components/ReactMovieMasher.tsx&stripImports=1&stripComments=1&jsx=Editor) -->

```tsx
>
}
}
```
<!-- MAGIC:END -->
</fieldset>

<!-- MAGIC:START (COLORSVG:src=dev/assets/diagram.svg&replacements=#333,#5e5e5e) -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:lucid="lucid" width="200"
  height="160">
  <g transform="translate(20 20)" lucid:page-tab-id="0_0">
    <path d="M0 6c0-3.3 2.7-6 6-6h148c3.3 0 6 2.7 6 6v108c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6z" stroke="currentColor"
      stroke-width="3" fill="none" />
    <path d="M50 76c0-3.3 2.7-6 6-6h88c3.3 0 6 2.7 6 6v8c0 3.3-2.7 6-6 6H56c-3.3 0-6-2.7-6-6z" stroke="#000"
      stroke-opacity="0" stroke-width="3" fill="#fff" fill-opacity="0" />
    <use xlink:href="#a" transform="matrix(1,0,0,1,55,75) translate(22.19135802469136 17.77777777777778)" />
    <defs>
      <path fill="currentColor" d="M205 0l-28-72H64L36 0H1l101-248h38L239 0h-34zm-38-99l-47-123c-12 45-31 82-46 123h93"
        id="b" />
      <path fill="currentColor"
        d="M160-131c35 5 61 23 61 61C221 17 115-2 30 0v-248c76 3 177-17 177 60 0 33-19 50-47 57zm-97-11c50-1 110 9 110-42 0-47-63-36-110-37v79zm0 115c55-2 124 14 124-45 0-56-70-42-124-44v89"
        id="c" />
      <path fill="currentColor"
        d="M212-179c-10-28-35-45-73-45-59 0-87 40-87 99 0 60 29 101 89 101 43 0 62-24 78-52l27 14C228-24 195 4 139 4 59 4 22-46 18-125c-6-104 99-153 187-111 19 9 31 26 39 46"
        id="d" />
      <g id="a">
        <use transform="matrix(0.06172839506172839,0,0,0.06172839506172839,0,0)" xlink:href="#b" />
        <use transform="matrix(0.06172839506172839,0,0,0.06172839506172839,14.814814814814813,0)" xlink:href="#c" />
        <use transform="matrix(0.06172839506172839,0,0,0.06172839506172839,29.629629629629626,0)" xlink:href="#d" />
      </g>
    </defs>
  </g>
</svg>

<!-- MAGIC:END -->

<!--

## Documentation

---

What follows is a quick start - see [MovieMasher.com](https://moviemasher.com/docs/index.html) for a deeper dive.

Alternatively, the **/dist/** directory in the [latest ZIP archive](https://github.com/moviemasher/moviemasher.js/archive/master.zip) contains both CJS (CommonJs) and UMD (Universal Module Defintion) builds. To install the later, simply upload **/dist/moviemasher.min.js** to your web host and use its path as the `src` attribute for a new `SCRIPT` element in your HTML.

This step can be skipped for UMD installations, since the `MovieMasher` object is automatically placed in the global scope. Depending on the build system, CJS installations may be able to use `import` or other mechanisms to include the library like:

```javascript
const MovieMasher = require('@moviemasher/moviemasher.js');
```



### Clone the GitHub Repository

The following command will copy the entire Git project to your local machine, complete with examples, tests, and documentation:

```shell
git clone https://github.com/moviemasher/moviemasher.js.git
```

Each instance of the player is bound to a canvas element and displays just a single mash within it, but this mash can contain any number of audio or video tracks having any number of clips on them. A mash is just a standard JavaScript Object that describes a collection of media and how to arrange it over time.

A player binds to its mash object directly, without copying or adding any methods. It may add default objects, arrays and scalar values though, for faster runtime parsing. Changes you make to the mash are reflected in the player the next time redraw() is called. Or as an alternative to direct data manipulation, you can use the player's add(), change() and remove() methods. When using these you can also call undo() and redo() to provide a complete edit history.



##### To Run Locally

Due to the security mechanisms used, this project can only be viewed in a web browser if delivered through a web server - simply viewing index.html locally in a browser will not work. If you are not running a web server on your local machine, [Docker](http://docker.com) is a safe and recommended way to do so. Once installed and running, `cd` into the _config/docker/development_ directory and:

- execute `docker-compose up -d` to launch apache web server
- load [http://localhost:8090/app](http://localhost:8090/app) in a web browser
- execute `docker-compose down -v` to terminate apache web server

### User Feedback

If any problems arise while utilizing this repository, a [GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed. Please include the mash description that's causing problems and any relevant console entries. Please post your issue ticket in the appropriate repository and refrain from cross posting - all projects are monitored with equal zeal.

### Contributing

Please join in the shareable economy by gifting your efforts towards improving this project in any way you feel inclined. Pull requests for fixes, features and refactorings are always appreciated, as are documentation updates. Creative help with graphics, video and the web site is also needed. Please contact through [MovieMasher.com](https://moviemasher.com) to discuss your ideas, or donate to the project.

#### Developer Setup

[Docker](http://docker.com) is required for working on the project itself. Once installed and running, `cd` into the _config/docker/node_ directory and:

- execute `docker-compose run --rm npm` to update node modules
- execute `docker-compose run --rm grunt` to rebuild JavaScript files

#### Known issues in this version

- new convolution filter is very beta - does not always match ffmpeg output
- little documentation - see angular-moviemasher for usage and moviemasher.rb for mash syntax
- video file playback not yet supported - they must be converted to image sequences and MP3 soundtracks
- audio filters not yet supported

 -->
