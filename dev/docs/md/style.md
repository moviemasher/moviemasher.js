Modern CSS techniques like flex, grid, and variables provide a relatively simple means
to powerfully affect the graphical appearance of the Editor.

CSS variables are used extensively within declarations to avoid repetition and allow nested components to elegantly override styling. Typically the coloring and sizing of all elements can be effectively controlled by overridding just a few variables. The `grid-template-*` properties are utilized to layout the main panels in an intuitive way.

If only a few changes are needed, it's typically easiest to just redefine select styles, as demonstrated in the [README](index.html#Client%20Example). For more elaborate changes, you may want to generate your own CSS file. The one used in the demos is a concatenation of all the files in the _packages/client-react/dev/css_ directory, which are explored here.

## Icons

The [[MasherPropsDefault]] function supports an `icons` property in its argument object, of type [[EditorIcons]]. If undefined, the [[DefaultIcons]] constant object is used by default. This includes a small subset of the
[remixicon-react](https://www.npmjs.com/package/remixicon-react) components related to media playback and editing. These ultimately compile as SVG elements with their `fill` attributes set to 'currentColor' so they are rendered in the parent's text color.

Most any SVG or font-based icons should work. Properties in the [[EditorIcons]] object are optional if the specific panels that use them aren't being included in the application. Some icon components insist on placing their icons within padding, so this needs to be accounted for in the `padding` value associated with head and foot styles.

<fieldset>
<legend>DefaultIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../packages/icons-default/src/EditorIcons/DefaultIcons.tsx&stripImports=1) -->

```tsx
export const DefaultIcons = {
  add: <RiAddLine key='add' />,
  administrator: <RiUserSettingsFill key='administrator' />,
  app: <img key='logo' src="mm.svg" />,
  audible: <RiVolumeUpLine key='audible' />,
  audio: <RiMusicLine />,
  broadcast: <RiBroadcastFill key='broadcast' />,
  browser: <MdPermMedia key='browser' />,
  browserAudio: <RiMusic2Fill />,
  browserAudioStream: <RiChatVoiceFill />,
  browserEffect: <MdInvertColors />,
  color: <IoColorFillSharp key="color" />,
  browserImage: <RiImageFill />,
  browserShape: <BiShapeTriangle />,
  browserText: <MdOutlineTextFields />,
  browserVideo: <RiFilmFill />,
  browserVideoStream: <RiVideoChatFill />,
  chat: <RiChat3Fill key='chat' />,
  clip: <MdOutlineTimelapse/>,
  collapse: <VscTriangleDown/>,
  collapsed: <VscTriangleRight/>,
  container: <FaExpand/>,
  content: <HiArrowsExpand/>,
  document: <IoDocument />,
  end: <BsSkipEndFill />,
  endUndefined: <BsSkipEnd />,
  folder: <RiFolderLine key='folder' />,
  folderAdd: <RiFolderAddFill key='folderAdd' />,
  folderOpen: <RiFolderOpenLine key='folderOpen' />,
  horz: <GiHorizontalFlip key="horz-flip" />,
  inaudible: <RiVolumeMuteLine key='inaudible' />,
  inspector: <RiEdit2Fill key='inspector' />,
  invisible: <RiEyeOffLine key='invisible' />,
  layer: <RiStackLine key='layer' />,
  layers: <RiStackFill key='layers' />,
  lock: <HiLockClosed />,
  matte: <BsReverseLayoutSidebarInsetReverse/>,
  message: <RiMessage3Fill key='message' />,
  mm: <MMIcon />,
  mmTube: <MMTubeIcon />,
  opacity: <MdOpacity key="opacity" />,
  playerPause: <RiPauseCircleFill key="player-pause" />,
  playerPlay: <RiPlayCircleFill key="player-play"/>,
  point: <GiMove key="point" />,
  redo: <RiArrowGoForwardLine />,
  remove: <RiDeleteBin7Line />,
  render: <ImFileVideo />,
  size: <GiResize key="size" />,
  start: <BsSkipStartFill />,
  streamers: <FaUserCircle key='streamers' />,
  timeline: <MdOutlineTimelapse key='timeline' />,
  timelineAddAudio: <RiMvLine />,
  timelineAddVideo: <RiVideoLine />,
  track: <GiFastForwardButton/>,
  trackDense: <GiPlayButton key="track-dense"/>,
  transition: <RiArrowLeftRightLine />,
  undo: <RiArrowGoBackLine />,
  unlock: <HiLockOpen />,
  upload: <RiUploadCloud2Line />,
  vert: <GiVerticalFlip key="vert-flip" />,
  video: <RiArrowRightSLine />,
  view: <HiEye />,
  visible: <RiEyeLine key='visible' />,
  zoomLess: <TiZoomOutOutline key="zoom-less" />,
  zoomMore: <TiZoomInOutline key="zoom-more" />,

}
```
<!-- MAGIC:END -->
</fieldset>

## Coloring

Movie Masher utilizes the HSL color model to generate a flexible palette with wide tonal range from a small collection of variables. It contains twelve core colors which can be broadly categorized as _back_ and _fore_ with _primary_, _secondary_, and _tertiary_ variations. Two additional variations of the secondary foreground color (used in panel headers and footers) are included to _promote_ or _demote_ child components.

It is expected that text or icons painted in a foreground color will always contrast well with the corresponding background color. To achieve this, Movie Masher defines six `lum-*` luminance variables (`primary`, `secondary`, and `tertiary` variations of `back` and `fore`) which are combined with two `hue-*` variables and three `sat-*` saturation variables to produce the dozen core colors.

These HSL variables are not used outside this file, so it's okay to remove them and define the `back-*`, `fore-*`, and `color-*` variables in some other way. The primary benefit to this approach is the ability to specify a different set of `lum-*` variables for both light and dark modes, as we do here.

<fieldset>
<legend>colors.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/colors.css&stripComments=1) -->

```css
.moviemasher {
  --button-transition:
      background-color 0.25s ease-out,
      border-color 0.25s ease-out,
      color 0.25s ease-out;
  --hue-back: 220;
  --hue-fore: 220;
  --sat-primary: 60%;
  --sat-secondary: 75%;
  --sat-tertiary: 80%;
  --lum-back-primary: 100%;
  --lum-back-secondary: 80%;
  --lum-back-tertiary: 60%;
  --lum-fore-primary: 50%;
  --lum-fore-secondary: 30%;
  --lum-fore-tertiary: 10%;
  --back-primary: hsl(0, 0%, var(--lum-back-primary));
  --back-secondary: hsl(0, 0%, var(--lum-back-secondary));
  --back-tertiary: hsl(0, 0%, var(--lum-back-tertiary));
  --fore-primary: hsl(0, 0%, var(--lum-fore-primary));
  --fore-secondary: hsl(0, 0%, var(--lum-fore-secondary));
  --fore-secondary-promote: var(--color-fore-primary);
  --fore-secondary-demote: var(---back-tertiary);
  --fore-tertiary: hsl(0, 0%, var(--lum-fore-tertiary));
  --color-back-primary: hsl(var(--hue-back), var(--sat-primary), var(--lum-back-primary));
  --color-back-secondary: hsl(var(--hue-back), var(--sat-secondary), var(--lum-back-secondary));
  --color-back-tertiary: hsl(var(--hue-back), var(--sat-tertiary), var(--lum-back-tertiary));
  --color-fore-primary: hsl(var(--hue-fore), var(--sat-primary), var(--lum-fore-primary));
  --color-fore-secondary: hsl(var(--hue-fore), var(--sat-secondary), var(--lum-fore-secondary));
  --color-fore-tertiary: hsl(var(--hue-fore), var(--sat-tertiary), var(--lum-fore-tertiary));
  --color-drop: red;
}

:root {
  color-scheme: dark light;
}

@media (prefers-color-scheme: dark) {
  .moviemasher {
    --lum-back-primary: 5%;
    --lum-back-secondary: 15%;
    --lum-back-tertiary: 20%;
    --lum-fore-primary: 30%;
    --lum-fore-secondary: 70%;
    --lum-fore-tertiary: 85%;
    --fore-secondary-promote: var(--color-fore-secondary);
    --fore-secondary-demote: var(--back-primary);
    --color-drop: yellow;
  }
}
```
<!-- MAGIC:END -->
</fieldset>

The primary background color typically matches the page background color, and is used around and between the panels as well as within their content areas. The secondary background color is used in panel borders, headers, and footers as well as content elements (clips in timeline, effects in inspector, and definitions in browser). The tertiary background color is used to demote in light mode.

The primary foreground color typically matches the page text color, and is used for text labels within the inspector. The secondary foreground color is used for borders and text of content elements, as well as text and icon buttons within headers and footers. The tertiary foreground color is the default for any other text or icons.

The `color-*` variants of these are used to paint selected content elements. During drag operations the background color is used to highlight areas that can potentially be dropped into. The foreground color is used for the timeline scrubber control, and to promote its buttons.

The icon button currently selected in the browser header is painted with the promote foreground color, as are the enabled buttons withing the timeline header. These buttons paint with the demote foreground color when disabled.Generally when something selected is hovered over, the next level of colors is used - for instance tertiary colors are swapped for secondary ones. When something promoted is hovered over, it is temporarily not promoted (but also not demoted) which effectively desaturates the element.

## Sizing

<fieldset>
<legend>sizes.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/sizes.css&stripComments=1) -->

```css
.moviemasher .editor {
  --padding: 40px;
  --spacing: 20px;
  --header-height: 38px;
  --footer-height: 48px;
  --preview-aspect-ratio: 16 / 9;
  --preview-width: 480px;
  --preview-height: 270px;
  --scrubber-height: 16px;
  --scrubber-width: 16px;
  --inspector-width: 240px;
  --track-width: 34px;
  --track-height: 60px;
  --icon-size: 24px;
  --button-size: 24px;
  --border-size: 1px;
  --border: var(--border-size) solid var(--back-tertiary);
  --border-radius: 5px;
  --drop-size: 2px;
  --progress-width: calc(2 * var(--icon-size));
}

.moviemasher .editor .panel .content {
  --padding: 20px;
  --spacing: 10px;
}

.moviemasher .editor .panel .foot,
.moviemasher .editor .panel .head {
  --padding: 5px;
  --spacing: 5px;
}

.moviemasher .editor .panel.composer .content {
  --padding: 10px;
  --spacing: var(--drop-size);
}

.moviemasher .editor .panel.composer .content .layer {
  --padding: 2px;
  --spacing: 5px;
}

.moviemasher .editor .panel.timeline .content {
  --spacing: 5px;
}
```
<!-- MAGIC:END -->
</fieldset>

## Layout

<fieldset>
<legend>layout.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/layout.css&stripComments=1) -->

```css
.moviemasher .masher {
  grid-template-areas:
    "player browser inspector"
    "timeline timeline inspector";
  grid-template-columns:
    calc(
      var(--preview-width)
      + (var(--border-size) * 2)
    )
    1fr
    var(--inspector-width);
  grid-template-rows:
    calc(
      var(--preview-height)
      + var(--header-height)
      + var(--footer-height)
    )
    1fr;
}


@media (max-width: 999px) {
  .moviemasher .editor {
    display: block;
    grid-template-areas: "player" "timeline" "inspector" "browser";
  }
  .moviemasher .editor .panel {
    margin-bottom: var(--spacing);
  }
}

.moviemasher .editor .panel .foot > .progress {
  grid-column-end: end;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr var(--progress-width) var(--icon-size);
  grid-gap: var(--spacing);
}
  

.moviemasher progress,
.moviemasher .progress-holder { width: var(--progress-width); }

.moviemasher .process-status {
  white-space: nowrap;
  overflow-x: hidden;
  text-align: right;
  font-size: initial;
}

.moviemasher .editor .panels {
  grid-area: panels;
	display: flex;
  flex-direction: column;
	gap: var(--spacing);
}

.moviemasher .editor .panel.timeline .content {
  --padding: 0px;
  --spacing: 2px;
}

.moviemasher .editor .panel {
  flex-grow: 1;
  overflow: hidden;
  display: grid;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  grid-template-columns: 1fr;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--back-primary);
}

.moviemasher .editor .panel.collapsed {
  grid-template-rows: var(--header-height);
  flex-grow: 0;
}

.moviemasher .editor .panel .head {
  border-bottom: var(--border);
  padding: var(--padding);
  column-gap: var(--spacing);
}

.moviemasher .editor .panel .foot {
  border-top: var(--border);
  padding: var(--padding);
  column-gap: var(--spacing);
}

.moviemasher .editor .panel .foot,
.moviemasher .editor .panel .head {
  background-color: var(--back-secondary);
  color: var(--fore-secondary);
  display: grid;
  line-height: var(--icon-size);
  font-size: var(--icon-size);
}

.moviemasher .editor .panel .head>*,
.moviemasher .editor .panel .foot>* {
  margin-block: auto;
}


.moviemasher .editor * {
  box-sizing: border-box;
}

.moviemasher .editor {
  width: 100%;
  display: grid;
  grid-column-gap: var(--spacing);
  grid-row-gap: var(--spacing);
  padding: var(--padding);
  background-color: var(--back-primary);
  color: var(--fore-tertiary);
}
```
<!-- MAGIC:END -->
</fieldset>

## Editor

<fieldset>
<legend>editor.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/editor.css&stripComments=1) -->

```css
.moviemasher .editor {
  user-select: none;
  -webkit-user-select: none;
}
.moviemasher .editor label {
  height: var(--icon-size);
}


.moviemasher .editor .panel button {
  display: inline-flex;
  min-width: var(--icon-size);
  height: var(--icon-size);
  cursor: pointer;
  appearance: none;
  outline: none;
  align-items: center;
  font-weight: 500;
  border: var(--border);
  border-radius: var(--border-radius);
  color: var(--fore-secondary-promote);
  border-color: var(--fore-secondary-promote);
  background-color: var(--back-secondary);
  transition: var(--button-transition);
}

.moviemasher .editor .icon-button {
  height: var(--icon-size);
  font-size: var(--icon-size);
  line-height: var(--icon-size);
}

.moviemasher .editor .icon-button:hover,
.moviemasher .editor .icon-button.selected {
  color: var(--fore-secondary-promote);
  transition: var(--button-transition);
}

.moviemasher .editor .panel button:hover {
  color: var(--fore-secondary);
  border-color: var(--fore-secondary);
}

.moviemasher .editor .panel button:disabled {
  color: var(--fore-secondary-demote);
  border-color: var(--fore-secondary-demote);
}

.moviemasher .editor .panel button > svg {
  margin: 0px 5px;
  margin-top: 1px;
  height: 1em;
  width: 1em;
}

.moviemasher .editor input[type=file] {
  visibility: hidden;
  vertical-align: bottom;
  width: 0px;
}
```
<!-- MAGIC:END -->
</fieldset>
## Browser Panel

<fieldset>
<legend>browser.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/browser.css&stripComments=1) -->

```css
.moviemasher .editor .panel.browser {
  grid-area: browser;
}

.moviemasher .editor .panel.browser .head {
  grid-template-columns: 1fr fit-content(var(--icon-size));
  overflow: hidden;
}

.moviemasher .editor .panel.browser .head .selected:hover {
  color: var(--fore-secondary);
}

.moviemasher .editor .panel.browser .foot {
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, var(--icon-size));
}




.moviemasher .editor .panel.browser .foot label {
  width: var(--icon-size);
}
.moviemasher .editor .panel.browser .foot label:hover {
  color: var(--fore-secondary-promote);
}

.moviemasher .editor .panel.browser .content {
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(var(--preview-width) / 3));
  grid-auto-rows: calc(var(--preview-height) / 3);
  gap: var(--spacing);
  overflow-y: auto;
}

.moviemasher .editor .panel.browser .definition {
  overflow-x: hidden;
  background-size: cover;
  background-image: var(--clip-icon);
  background-position: center;
  border: var(--border);
  border-radius: var(--border-radius);
  border-color: var(--fore-secondary);
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
}

.moviemasher .editor .panel.browser .content .definition:hover,
.moviemasher .editor .panel.browser .content .selected {
  border-color: var(--color-fore-secondary);
  color: var(--color-fore-secondary);
  background-color: var(--color-back-secondary);
}

.moviemasher .editor .panel.browser .content .selected:hover {
  border-color: var(--color-fore-tertiary);
  color: var(--color-fore-tertiary);
  background-color: var(--color-back-tertiary);
}

.moviemasher .editor .panel.browser .definition label {
  display: inline-block;
  width: 100%;
  background-color: var(--back-primary);
  opacity: 0.75;
  height: calc(var(--icon-size) + var(--spacing));
}

.moviemasher .editor .panel.browser .definition label:after {
  content: var(--clip-label);
  padding: var(--spacing);
  display: inline-block;
}
```
<!-- MAGIC:END -->
</fieldset>

## Timeline Panel

<fieldset>
<legend>timeline.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/timeline.css&stripComments=1) -->

```css
.moviemasher .editor .panel.timeline {
  isolation: isolate;
  grid-area: timeline;
}

.moviemasher .editor .panel.timeline .head {
  grid-template-columns: 1fr repeat(6, auto) 1fr min-content;
}

.moviemasher .editor .panel.timeline .foot {
  grid-auto-flow: column;
  grid-template-columns: repeat(4, min-content) ;
}

.moviemasher .editor .panel.timeline .content {
  overflow: auto;
  overscroll-behavior: none;
  display: grid;
  grid-template-columns: var(--track-width) 1fr;
  grid-template-rows: var(--scrubber-height) repeat(auto-fill, var(--track-height));
  row-gap: var(--spacing);
  padding: var(--padding);
  position: relative;
}

.moviemasher .editor .panel.timeline .content .scrubber-bar,
.moviemasher .editor .panel.timeline .content .scrubber-icon {
  z-index: 3;
  position: -webkit-sticky;
  position: sticky;
  left: var(--track-width);
}

.moviemasher .editor .panel.timeline .content .scrubber-bar {
  pointer-events: none;
  top: var(--scrubber-height);
}

.moviemasher .editor .panel.timeline .content .scrubber-icon {
  box-shadow: calc(-1 * var(--track-width)) 0 0 0 var(--back-secondary);
  --spacing: 4px;
  top: 0px;
  background-color: var(--back-secondary);
}
.moviemasher .editor .panel.timeline .content .scrubber-element-bar,
.moviemasher .editor .panel.timeline .content .scrubber-element-icon {
  position: absolute;
  background-color: var(--color-fore-secondary);
}

.moviemasher .editor .panel.timeline .content .scrubber-element-bar {
  width: 1px;
  top: 0px;
  bottom: 0px;
}

.moviemasher .editor .panel.timeline .content .scrubber-element-icon {
  --half-width: calc(var(--scrubber-width) / 2);
  margin-left: calc(0px - (var(--scrubber-width) / 2));
  width: var(--scrubber-width);
  height: var(--scrubber-height);
  clip-path: polygon(
    0 var(--spacing),
    var(--scrubber-width) var(--spacing),
    calc(50% + 1px) var(--scrubber-height),
    50% var(--scrubber-height)
  );
}

.moviemasher .editor .panel.timeline .content .timeline-sizer {
  pointer-events: none;
  position: absolute;
  top: var(--scrubber-height);
  left: var(--track-width);
  bottom: 0px;
  right: 0px;
}

.moviemasher .editor .panel.timeline .content .track {
  --drop-size: var(--border-size);
  display: flex;
  border: var(--border);
  overflow: hidden;
  background-color: var(--back-primary);
  white-space: nowrap;
}

.moviemasher .editor .panel.timeline .content .track.selected {
  background-color: var(--color-back-primary);
}


.moviemasher .editor .panel.timeline .content .track .clip {
  border-inline: var(--border);
  overflow: hidden;
  background-size: cover;
  background-image: var(--clip-icon);
  padding: 0px;
  display: inline-block;
  background-repeat: no-repeat;
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
}

.moviemasher .editor .panel.timeline .content .track .clip:hover,
.moviemasher .editor .panel.timeline .content .track .selected {
  color: var(--color-fore-secondary);
  border-color: var(--color-fore-secondary);
  background-color: var(--color-back-secondary);
}

.moviemasher .editor .panel.timeline .content .track .selected:hover {
  color: var(--color-fore-tertiary);
  border-color: var(--color-fore-tertiary);
  background-color: var(--color-back-tertiary);
}

.moviemasher .editor .panel.timeline .clip label {
  overflow: hidden;
  display: inline-block;
  width: 100%;
  background-color: var(--back-primary);
  opacity: 0.75;
  height: calc(var(--icon-size) + var(--spacing));
}

.moviemasher .editor .panel.timeline .clip label:after {
  content: var(--clip-label);
  padding: var(--spacing);
  display: inline-block;
}

.moviemasher .editor .panel.timeline .content .track.dropping {
  border-block-color: var(--color-drop);
}

.moviemasher .editor .panel.timeline .content .track-icon {
  border-block: var(--border);
  background-color: var(--back-secondary);
  color: var(--fore-secondary);
  display: flex;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
  height: var(--track-height);
}

.moviemasher .editor .panel.timeline .content .track-icon.selected {
  background-color: var(--color-back-secondary);
  color: var(--color-fore-secondary);
}

.moviemasher .editor .panel.timeline .content .track-icon svg {
  margin: auto;
}
.moviemasher .editor .panel.timeline .content .track-icon.dropping {
  border-color: var(--color-drop);

}
.moviemasher .editor .panel.timeline .content .track .clip.dropping {
  border-color: var(--color-drop);
  box-shadow:
    0 var(--drop-size) 0 0 var(--color-drop),
    0 calc(-1 * var(--drop-size)) 0 0 var(--color-drop)
  ;
}

.moviemasher .editor .panel.timeline .content .track .clip.dropping-before {
  box-shadow: calc(-1 * var(--drop-size)) 0 0 0 var(--color-drop);
}
.moviemasher .editor .panel.timeline .content .track .clip.dropping-after {
  box-shadow: var(--drop-size) 0 0 0 var(--color-drop);
}
```
<!-- MAGIC:END -->
</fieldset>

## Player Panel

<fieldset>
<legend>player.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/player.css&stripComments=1) -->

```css
.moviemasher .editor .panel.player {
  grid-area: player;
}

.moviemasher .editor .panel.player .head {
  grid-auto-flow: column;
  grid-template-columns: 1fr repeat(auto-fill, min-content);
}

.moviemasher .editor.masher .panel.player .foot {
  grid-template-columns: var(--icon-size) 1fr 1fr;
}

.moviemasher .editor.caster .panel.player .foot {
  grid-template-columns: repeat(5, min-content);
}


.moviemasher .editor .panel.player .content {
  background: repeating-conic-gradient(
    var(--back-secondary) 0% 25%, transparent 0% 50%
  ) 50% / 20px 20px;
  background-position: top left;
  width: var(--preview-width);
  height: var(--preview-height);
  margin-inline: auto;
  color: var(--color-fore-tertiary);
}


.moviemasher .editor .panel.player .content svg {
  pointer-events: visibleFill;
}

.moviemasher .editor .panel.player .content svg .container {
  cursor: move;
  pointer-events: visibleFill;
}
.moviemasher .editor .panel.player .content svg .contained {
  pointer-events: none;
}

.moviemasher .editor .panel.player .content svg .bounds {
  stroke-width: calc(2 * var(--border-size));
  pointer-events: visibleStroke;
  
}

.moviemasher .editor .panel.player .content svg .handle.ne {
  cursor: ne-resize;
}
.moviemasher .editor .panel.player .content svg .handle.se {
  cursor: se-resize;
}
.moviemasher .editor .panel.player .content svg .handle.nw {
  cursor: nw-resize;
}
.moviemasher .editor .panel.player .content svg .handle.sw {
  cursor: sw-resize;
}
.moviemasher .editor .panel.player .content svg .handle.n {
  cursor: n-resize;
}
.moviemasher .editor .panel.player .content svg .handle.s {
  cursor: s-resize;
}
.moviemasher .editor .panel.player .content svg .handle.e {
  cursor: e-resize;
}
.moviemasher .editor .panel.player .content svg .handle.w {
  cursor: w-resize;
}

.moviemasher .editor .panel.player .content svg .shape {
  stroke: transparent;
  stroke-width: calc(2 * var(--border-size));
}
.moviemasher .editor .panel.player .content svg .shape:hover {
  stroke: var(--color-fore-secondary);
}

.moviemasher .editor .panel.player .content svg .shape.marker {
  marker-mid: url(#shape-marker);
  stroke: var(--color-fore-secondary);
}
```
<!-- MAGIC:END -->
</fieldset>

## Inspector Panel

<fieldset>
<legend>inspector.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/dev/css/inspector.css&stripComments=1) -->

```css
.moviemasher .editor .panel.inspector {
  grid-area: inspector;
}

.moviemasher .editor .panel.inspector .foot {
  grid-auto-columns: min-content;
  grid-auto-flow: column;
}
.moviemasher .editor .panel.inspector .content fieldset {
  line-height: var(--icon-size);
  font-size: var(--icon-size);
  padding: var(--spacing);
}
.moviemasher .editor .panel.inspector .content .start-end {
  display: flex;
  float: right;
}

.moviemasher .editor .panel.inspector .content fieldset > legend {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr min-content;
  width: 100%;
}

.moviemasher .editor .panel.inspector .content fieldset > div {
  display: grid;
  gap: var(--spacing);
  grid-auto-flow: column;
}
.moviemasher .editor .panel.inspector .content fieldset > div.size {
  grid-template-columns: var(--icon-size) minmax(50px, 1fr) var(--icon-size);
}

.moviemasher .editor .panel.inspector .content fieldset > div.point {
  grid-template-columns: repeat(2, var(--icon-size)) minmax(50px, 1fr) var(--icon-size);
}
.moviemasher .editor .panel.inspector .content .opacity,
.moviemasher .editor .panel.inspector .content .color {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing);
  grid-template-columns: var(--icon-size) minmax(50px, 1fr) min-content;
  line-height: var(--icon-size);
  font-size: var(--icon-size);
}

.moviemasher .editor .panel.inspector details>div>label {
  text-transform: capitalize;
}

.moviemasher .editor .panel.inspector details>div>label:after {
  content: ':';
}

.moviemasher .editor .panel.inspector .content {
  overflow-y: auto;
  padding: var(--padding);
}

.moviemasher .editor .panel.inspector .content>* {
  margin-bottom: var(--spacing);
}


.moviemasher .editor .panel.inspector .effects {
  width: 100%;
  height: calc((3 * var(--icon-size)) + (4 * var(--spacing)));
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacing);
  color: var(--fore-primary);
  border-color: var(--fore-primary);
  background-color: var(--back-primary);
  overflow-y: scroll;
}


.moviemasher .editor .panel.inspector .definition-drop {
  display: grid;
  width: 100%;
  aspect-ratio: var(--preview-aspect-ratio);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacing);
  color: var(--fore-primary);
  border-color: var(--fore-primary);
  background-color: var(--back-primary);
}


.moviemasher .editor .panel.inspector .definition {
  overflow-x: hidden;
  background-size: cover;
  background-image: var(--clip-icon);
  background-position: center;
  border: var(--border);
  border-radius: var(--border-radius);
  border-color: var(--fore-secondary);
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
}


.moviemasher .editor .panel.inspector .effects .effect {
  width: 100%;
  height: var(--icon-size);
  border: var(--border);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing);
  padding: var(--border-radius);
  color: var(--fore-secondary);
  border-color: var(--fore-secondary);
  background-color: var(--back-secondary);
}


.moviemasher .editor .panel.inspector .effects .effect:hover,
.moviemasher .editor .panel.inspector .effects .selected {
  color: var(--color-fore-secondary);
  border-color: var(--color-fore-secondary);
  background-color: var(--color-back-secondary);
}

.moviemasher .editor .panel.inspector .effects .selected:hover {
  color: var(--color-fore-tertiary);
  border-color: var(--color-fore-tertiary);
  background-color: var(--color-back-tertiary);
}


.moviemasher .editor .panel.inspector .dropping {
  background-color: var(--color-back-secondary);
}
```
<!-- MAGIC:END -->
</fieldset>
