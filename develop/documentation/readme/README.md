<style>
  summary,
  fieldset { margin: 1em 0; }
  legend { font-weight: bold; padding: 0 1em; }
</style>

[![Image](develop/assets/moviemasher-logo.png "Movie Masher")](https://moviemasher.com)

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

<!-- MAGIC:START (TRIMCODE:src=develop/index.html) -->

CODE...

<!-- MAGIC:END -->
</fieldset>

Within our code we render the editor, and can optionally define media assets that will
appear within the Browser Panel. Several Themes and Effects are predefined, as
well as a single Font - but no Images, Video, or Audio will appear in the Browser by default.

<fieldset>
<legend>index.jsx</legend>

<!-- MAGIC:START (TRIMCODE:src=packages/react-moviemasher/develop/workspaces/php/index.jsx) -->

CODE...

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

<!-- MAGIC:START (TRIMCODE:src=develop/css/colors.css&stripComments=1) -->

CODE...

<!-- MAGIC:END -->
</fieldset>
</details>

<details>
<summary>Sizing</summary>

Blah...

<fieldset>
<legend>dimensions.css</legend>

<!-- MAGIC:START (TRIMCODE:src=develop/css/dimensions.css&stripComments=1) -->

CODE...

<!-- MAGIC:END -->
</fieldset>
</details>

<details>
<summary>Positioning</summary>

Blah...

<fieldset>
<legend>layout.css</legend>

<!-- MAGIC:START (TRIMCODE:src=develop/css/layout.css&stripComments=1) -->

CODE...

<!-- MAGIC:END -->
</fieldset>
</details>

## Icons

---

<fieldset>
<legend>MaterialIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=packages/react-moviemasher/src/Components/Editor/EditorIcons/MaterialIcons.tsx&stripImports=1&stripExports=1) -->

CODE...

<!-- MAGIC:END -->
</fieldset>

## Customization

---

- Editor
  - PlayerPanel
    - Preview
    - PlayButton
      - Playing
      - Paused
    - TimeSlider
    - VolumeSlider
    - MuteButton
  - BrowserPanel (Browser)
    - BrowserContent
    - BrowserSource
  - TimelinePanel (MMTimeline)
    - ScrubControl (Scrub)
    - ScrubElement (ScrubButton)
    - ScrubArea (TimelineSizer)
    - ZoomSlider
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

CODE...

<!-- MAGIC:END -->
</fieldset>

<!-- MAGIC:START (COLORSVG:src=../../assets/diagram.svg&replacements=#333,#5e5e5e) -->
<!-- MAGIC:END -->

<iframe src="https://moviemasher.com/demo/index.html "/>
<!--

Import the library into your JavaScript code to include the `MovieMasher` object in its scope:

Use moviemasher.js to edit and display mashups of video, audio, and images within a canvas element. Its player works like the native HTML5 video player, but adds support for additional media types, multitrack compositing, effects, transitions and even titling using your custom fonts.

## Documentation

---

What follows is a quick start - see [MovieMasher.com](https://moviemasher.com/docs/index.html) for a deeper dive.

Alternatively, the **/dist/** directory in the [latest ZIP archive](https://github.com/moviemasher/moviemasher.js/archive/master.zip) contains both CJS (CommonJs) and UMD (Universal Module Defintion) builds. To install the later, simply upload **/dist/moviemasher.min.js** to your web host and use its path as the `src` attribute for a new `SCRIPT` element in your HTML.

This step can be skipped for UMD installations, since the `MovieMasher` object is automatically placed in the global scope. Depending on the build system, CJS installations may be able to use `import` or other mechanisms to include the library like:

```javascript
const MovieMasher = require("@moviemasher/moviemasher.js");
```

## Usage

A typical use case involves binding a new `Masher` object to a `CANVAS` element in your HTML, and then manipulating its `Mash` object by adding `Track` and `Clip` objects of various types - `Audio`, `Transition`, `Video`, `Image`, and `Theme`. Some types (`Video`, `Image`, and `Theme`) are `Transformable` so have `Merger` and `Scaler` objects that control their transformation. These types can also have multiple `Effect` objects that augment their appearance.

### Add Canvas to HTML

Include a new `CANVAS` element somewhere in your HTML and size it either directly or with CSS:

```html
<canvas id="moviemasher-canvas" width="320" height="180" />
```

### Create Masher and bind to Canvas

The main `MovieMasher` object provides access to factory/builder objects that are used to construct all other objects. Typically your first step is to construct a `Masher` object, which will immediately draw to your `CANVAS` element:

```javascript
const canvas = document.getElementById("moviemasher-canvas");
const masher = MovieMasher.masher.instance({ canvas });
```

### Manipulate Masher's Mash

By default, a new `Masher` object will draw a new empty `Mash` object, and the default value for its `backcolor` property is transparent so nothing appears to happen after the code above executes! To draw any valid HTML color instead, any of the following approaches could be used:

```javascript
masher.mash = MovieMasher.mash.instance({ backcolor: "yellow" }); // replace Mash
masher.changeMash("backcolor", "yellow"); // set backcolor of existing mash
masher.change("backcolor", "yellow"); // same as above, when no clips selected
```

Alternatively, the `Mash` instance could have been provided as an additional property along with the `CANVAS` element when creating the `Masher`. You could also have just set `masher.mash.backcolor` directly, but you'd need to then call `mash.draw()` to see the result and you couldn't then call `masher.undo()` to revert the change.

### Add a Theme Clip

```javascript
masher.addClip(MovieMasher.theme.fromId("com.moviemasher.theme.color")); // add color clip
masher.add({ id: "com.moviemasher.theme.color" }); // same as above, but more flexible
```

---

masher.add({ type: 'image', url: 'media/image/cable.jpg', frames: 2 });
masher.mash = MovieMasher.mash.instance({ video: {clips: [{id: 'com.moviemasher.theme.color'}]} }) // replace Mash

### Clone the GitHub Repository

The following command will copy the entire Git project to your local machine, complete with examples, tests, and documentation:

```shell
git clone https://github.com/moviemasher/moviemasher.js.git
```

Each instance of the player is bound to a canvas element and displays just a single mash within it, but this mash can contain any number of audio or video tracks having any number of clips on them. A mash is just a standard JavaScript Object that describes a collection of media and how to arrange it over time.

A player binds to its mash object directly, without copying or adding any methods. It may add default objects, arrays and scalar values though, for faster runtime parsing. Changes you make to the mash are reflected in the player the next time redraw() is called. Or as an alternative to direct data manipulation, you can use the player's add(), change() and remove() methods. When using these you can also call undo() and redo() to provide a complete edit history.

##### Basic slideshow with audio

```JavaScript
const context = document.getElementById("mm-canvas").getContext('2d');
consts masher = new Masher({ visibleContext: context, autoplay: true });

masher.add({ type: 'image', url: 'media/image/frog.jpg', frames: 2 });
masher.add({ type: 'audio', url: 'media/audio/loop.mp3', duration: 2 });

// OR, more verbosely...

masher.mash = {
  "media": [
    { "id": "image-cable", "type": "image", "url": "media/image/cable.jpg" },
    { "id": "image-frog", "type": "image", "url": "media/image/frog.jpg" },
    { "id": "audio-id", "type": "audio", "duration": 2, "url": "media/audio/loop.mp3" }
  ],
  "video": [ {
    "type": "video",
    "clips": [
      { "id": "image-cable", "frame": 0, "frames": 2 },
      { "id": "image-frog", "frame": 0, "frames": 2 }
    ]
  } ],
  "audio": [ {
    "type": "audio",
    "clips": [ { "id": "audio-id", "frame": 0, "frames": 4 } ]
  } ]
};
```

##### To Run Locally

Due to the security mechanisms used, this project can only be viewed in a web browser if delivered through a web server - simply viewing index.html locally in a browser will not work. If you are not running a web server on your local machine, [Docker](http://docker.com) is a safe and recommended way to do so. Once installed and running, `cd` into the _config/docker/development_ directory and:

- execute `docker-compose up -d` to launch apache web server
- load [http://localhost:8090/app](http://localhost:8090/app) in a web browser
- execute `docker-compose down -v` to terminate apache web server

### Related Projects

Three separate projects - _moviemasher.js, angular-moviemasher and moviemasher.rb_ - can be combined to engineer a complete, browser-based audio/video editing and encoding system. Or projects can be utilized independently, if only editing or encoding features are needed. Only angular-moviemasher is dependent on the other projects, since it's designed to sit between them as a middleware layer providing content management functions.

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

#### Migrating from Version 4.0.7

- The `begin` key in video clips has been renamed `first`.
- The `length` key in clips has been renamed `frames`.
- The `audio` and `video` keys in mash tracks have been moved to mash.
- The `tracks` key in mashes has been removed. -->
