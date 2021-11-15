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
npm install react react-dom @moviemasher/react-moviemasher --save
```

## Usage

---

Along with our compiled JavaScript file, we need to the CSS file that corresponds to the
Editor we want to display. Since most of interface elements scroll both horizontally and
vertically, the Editor is also typically rendered into a node that is styled to fill the
whole window.

<fieldset>
<legend>index.html</legend>
amazing
<!-- MAGIC:START (TRIMCODE:src=dev/index.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <style>
      body { margin: 0px; padding: 0px; font-family: sans-serif; }
      body, #app { width: 100vw; height: 100vh; display: flex; }
    </style>
    <link href='css/editor.css' rel='stylesheet'>
    <script src='index.js' defer></script>
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
<legend>index.jsx</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/workspaces/react-moviemasher/index.jsx) -->

```jsx
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { DefinitionType, Factory, ReactMovieMasher, RemixIcons, DefaultInputs } from "@moviemasher/react-moviemasher"

Factory[DefinitionType.Image].install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory[DefinitionType.Audio].install({
  label: "Loop", id: "id-loop-audio",
  url: "assets/raw/loop.mp3", loops: true, duration: 5,
})

Factory[DefinitionType.Audio].install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "assets/raw/monster-mash.mp3", duration: 180,
})

Factory[DefinitionType.VideoSequence].install({
  label: "Sequence", id: "id-video-sequence", source: 'assets/raw/video/original.mp4',
  audio: "assets/raw/video/audio.mp3",
  url: "assets/raw/video/256x144x10/", duration: 79, fps: 10,
})

Factory[DefinitionType.Video].install({
  label: "Video", id: "id-video", url: 'assets/raw/timing.mp4',
  duration: 3, fps: 10,
})

Factory[DefinitionType.VideoStream].install({
  label: "Stream", id: "id-video-stream",
  duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

Factory[DefinitionType.Font].install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/raw/BlackoutTwoAM.ttf",
})

const testMashObject = () => {
  console.warn("TODO: remove mash content")

  const clips = [
    { id: "id-image", frame: 0, frames: 100 },
    { id: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
    { id: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "Woot woot!" },
    { id: "com.moviemasher.theme.color", frame: 250, frames: 50, color: "green"},
    { id: "com.moviemasher.theme.text", frame: 300, frames: 100, string: "Love it!" },
    { id: "com.moviemasher.theme.color", frame: 400, frames: 50, color: "red"},
    { id: "com.moviemasher.theme.text", frame: 450, frames: 100, string: "Juicy!" },
    { id: "com.moviemasher.theme.color", frame: 550, frames: 50, color: "yellow"},
    { id: "com.moviemasher.theme.text", frame: 600, frames: 100, string: "Gorgeous!" },
    { id: "com.moviemasher.theme.color", frame: 700, frames: 50, color: "violet"},
    { id: "com.moviemasher.theme.text", frame: 750, frames: 1100, string: "Joy!" },
    { id: "com.moviemasher.theme.color", frame: 1850, frames: 1000, color: "orange"},
  ]
  const clips1 = clips.slice(0, 5).map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  const clips2 = clips.map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  const clips3 = clips.filter((clip, index) => index % 2).map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  // const video = [{ clips: clips1 }, { clips: clips3 }, { clips: clips2 }]
  const video = [{ clips: [{ id: "id-video", frame: 0, frames: 30 }] }]
  return {
    id: 'mash-id',
    backcolor: '#00FF0066',
    video
  }
}
const urlParams = new URLSearchParams(window.location.search)
const server = urlParams.get('server')

const applicationOptions = {
  server,
  mash: Factory.mash.instance(testMashObject()),
  icons: RemixIcons, inputs: DefaultInputs,
  panels: {browser:{header: {right: RemixIcons.browserVideo}}},
}


const application = <ReactMovieMasher {...applicationOptions} />

render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
```
<!-- MAGIC:END -->
</fieldset>

## Styling

---

Modern CSS techniques like grid layout and root variables provide a relatively simple means to powerfully affect graphical appearance of the Editor. If just a few changes are needed, it's easiest to just redefine select styles from the _css/editor.css_ file we included in _index.html_ above. This file is a concatenation of the other files within that directory, shown below. An alternative approach for more elaborate changes would be to replace one or more of these files and include them individually.

<details>
<summary>Coloring</summary>

Blah...

<fieldset>
<legend>colors.css</legend>

<!-- MAGIC:START (TRIMCODE:src=dev/css/colors.css&stripComments=1) -->

```css
:root {
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
  :root {
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
:root {
  --moviemasher-border-size: 1px;
  --moviemasher-border-radius: calc(5 * var(--moviemasher-border-size));
  --moviemasher-spacing: 20px;
  --moviemasher-padding: 40px;
  --moviemasher-spacing-controls: 4px;
  --moviemasher-padding-controls: 2px;
  --moviemasher-padding-button-factor: 4;
  --moviemasher-spacing-content: 10px;
  --moviemasher-padding-content: 20px;
  --moviemasher-width-preview: 480px;
  --moviemasher-height-preview: 270px;
  --moviemasher-height-scrub: 16px;
  --moviemasher-width-inspector: 240px;
  --moviemasher-icon-size: 24px;
  --moviemasher-button-size: 24px;
  --moviemasher-border: var(--moviemasher-border-size) solid var(--moviemasher-fore-primary);
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

.moviemasher-app {
  width: 100%;
  display: grid;
  grid-template-areas:
    "player browser inspector"
    "timeline timeline inspector";
  grid-column-gap: var(--moviemasher-spacing);
  grid-template-columns:
    calc(
      var(--moviemasher-width-preview)
      + (var(--moviemasher-border-size) * 2)
    )
    1fr
    var(--moviemasher-width-inspector);
  grid-row-gap: var(--moviemasher-spacing);
  grid-template-rows:
    calc(
      var(--moviemasher-height-preview)
      + var(--moviemasher-icon-size)
      + (var(--moviemasher-padding-controls) * 2)
      + (var(--moviemasher-border-size) * 3)
    )
    1fr;
  padding: var(--moviemasher-padding);
  background-color: var(--moviemasher-back-primary);
  color: var(--moviemasher-fore-tertiary);
}

.moviemasher-panel {
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  border: var(--moviemasher-border);
  border-radius: var(--moviemasher-border-radius);
  background-color: var(--moviemasher-back-secondary);
}

.moviemasher-head {
  grid-area: head;
  border-bottom: var(--moviemasher-border);
}

.moviemasher-foot {
  grid-area: foot;
  border-top: var(--moviemasher-border);
}

.moviemasher-foot,
.moviemasher-head {
  background-color: var(--moviemasher-back-tertiary);
  display: grid;
  padding: var(--moviemasher-padding-controls);
  column-gap: var(--moviemasher-spacing-controls);
}

.moviemasher-content { grid-area: content; }

.moviemasher-control {
  min-width: var(--moviemasher-icon-size);
  height: var(--moviemasher-icon-size);
  background-color: transparent;
  padding: 0px;
  cursor: pointer;
  appearance: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  font-size: 1.3rem;
  border: none;
}

.moviemasher-button {
  color: var(--moviemasher-color-mute);
  margin: 0px;
  height: var(--moviemasher-icon-size);
}

.moviemasher-button:hover {
  color: var(--moviemasher-color);
  border-color: var(--moviemasher-color);
}

.moviemasher-button-icon {
  line-height: var(--moviemasher-button-size);
  display: inline-block;
  color: var(--moviemasher-color-mute);
}


button.moviemasher-button-text>.moviemasher-button-icon {
  font-size: 20px;
}

button.moviemasher-button-text>.moviemasher-button-icon-start {
  margin: 0px 8px 0px -4px;
}

button.moviemasher-button-text>.moviemasher-button-icon-end {
  margin: 0px -4px 0px 8px;
}

.moviemasher-browser {
  grid-area: browser;
  grid-template-rows: calc(
    (var(--moviemasher-padding-controls) * 2) + var(--moviemasher-button-size)
  ) 1fr;
  grid-template-areas: "head" "content";
}

.moviemasher-browser .moviemasher-head {
  padding: var(--moviemasher-padding-controls);
}

.moviemasher-browser .moviemasher-head {
  grid-template-columns: repeat(auto-fit, var(--moviemasher-icon-size));
  overflow: hidden;
}

.moviemasher-browser .moviemasher-content {
  padding: var(--moviemasher-padding-content);
  display: grid;
  grid-template-columns: repeat(auto-fit, 160px);
  grid-auto-rows: 90px;
  gap: var(--moviemasher-spacing-content);
  overflow-y: auto;
}


.moviemasher-inspector {
  grid-area: inspector;
  grid-template-rows:
    1fr
    calc(
      var(--moviemasher-button-size) +
      (2 * (var(--moviemasher-padding-controls) + var(--moviemasher-border-size)))
    );
  grid-template-areas: "content" "foot";
}
.moviemasher-inspector label {
  text-transform: capitalize;

}
.moviemasher-inspector label::after {
  content: ': ';
}

.moviemasher-inspector .moviemasher-content {
  overflow-y: auto;
  padding: var(--moviemasher-padding-content);
}

.moviemasher-inspector .moviemasher-content > * {
  margin-bottom: var(--moviemasher-spacing-content);
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
  grid-template-areas: "head" "content" "foot";
  grid-template-rows:
    calc(
      var(--moviemasher-button-size)
      + var(--moviemasher-border-size)
      + (
          2
          * var(--moviemasher-padding-button-factor)
          * var(--moviemasher-padding-controls)
        )
    )
    1fr
    calc(
      var(--moviemasher-icon-size)
      + var(--moviemasher-border-size)
      + (2 * var(--moviemasher-padding-controls))
    );
}

.moviemasher-timeline .moviemasher-head {
  padding: calc(
    var(--moviemasher-padding-controls)
    * var(--moviemasher-padding-button-factor)
  );
  grid-template-columns: repeat(9, auto) 1fr;
  grid-template-areas: "undo redo cut copy paste delete split save render";
}

.moviemasher-timeline .moviemasher-content {
  position: relative;
  overflow: auto;
  display: grid;
  grid-template-areas: "scrubber-icon scrubber" "tracks-icon tracks";
  grid-template-columns: var(--moviemasher-icon-size) 1fr;
  grid-template-rows: var(--moviemasher-height-scrub) 1fr;
}

.moviemasher-timeline button.moviemasher-button {
  height: var(--moviemasher-button-size);
  padding: 5px 15px;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--moviemasher-color-mute);
  border-radius: 4px;
}

.moviemasher-timeline .moviemasher-clip { overflow: hidden; }

.moviemasher-tracks {
  grid-area: tracks;
  grid-column-start: tracks-icon;
}

.moviemasher-scrub-pad,
.moviemasher-scrub {
  background-color: var(--moviemasher-back-secondary);
  border-bottom: var(--moviemasher-border);position: -webkit-sticky;
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

.moviemasher-timeline-sizer {
  pointer-events: none;
  position: absolute;
  left: var(--moviemasher-icon-size);
  right: 0px;
  top: var(--moviemasher-height-scrub);
  bottom: 0px;
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


.moviemasher-track {
  display: grid;
  grid-template-columns: var(--moviemasher-icon-size) 1fr;

}

.moviemasher-track .moviemasher-track-icon {
  background-color: var(--moviemasher-back-secondary);
  position: -webkit-sticky;
  position: sticky;
  left: 0;
}

.moviemasher-clips {
  white-space: nowrap;
}


.moviemasher-definition,
.moviemasher-clip {
  display: inline-block;
  padding: var(--moviemasher-padding-controls);
  background-color: var(--moviemasher-back-tertiary);
  border: var(--moviemasher-border);
  border-radius: var(--moviemasher-border-radius);
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
  grid-template-areas: "content" "foot";
  
  grid-template-rows: var(--moviemasher-height-preview) 1fr;
}

.moviemasher-player .moviemasher-foot {
  grid-template-columns: var(--moviemasher-icon-size) 1fr 1fr;
  grid-template-areas: "paused frame volume";
}

.moviemasher-paused {
  grid-area: paused;
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
<legend>MaterialIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=packages/react-moviemasher/src/Components/Editor/EditorIcons/MaterialIcons.tsx&stripImports=1&stripExports=1) -->

```tsx
const MaterialIcons : EditorIcons = {
  browserAudio: <LibraryMusic />,
  browserEffect: <Theaters />,
  browserImage: <PhotoSizeSelectLarge />,
  browserTheme: <PhotoSizeSelectLarge />,
  browserVideo: <MovieFilter />,
  playerPause: <PauseIcon />,
  playerPlay: <PlayIcon />,
  timelineAudio: <VolumeIcon />,
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
