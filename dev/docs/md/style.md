Modern CSS techniques like flex, grid, and variables provide a relatively simple means
to powerfully affect the graphical appearance of the Editor.

CSS variables are used extensively within declarations to avoid repetition and allow nested components to elegantly override styling. Typically the coloring and sizing of all elements can be effectively controlled by overridding just a few variables. The `grid-template-*` properties are utilized to layout the main panels in an intuitive way.

If only a few changes are needed, it's typically easiest to just redefine select styles, as demonstrated in the [README](index.html#Client%20Example). For more elaborate changes, you may want to generate your own CSS file. The one used in the demos is a concatenation of all the files in the _packages/client-react/dev/css_ directory, which are explored here.

## Icons

The [[DefaultMasherProps]] function supports an `icons` property in its argument object, of type [[EditorIcons]]. If undefined, the [[DefaultIcons]] constant object is used by default. This includes a small subset of the
[remixicon-react](https://www.npmjs.com/package/remixicon-react) components related to media playback and editing. These ultimately compile as SVG elements with their `fill` attributes set to 'currentColor' so they are rendered in the parent's text color.

Most any SVG or font-based icons should work. Properties in the [[EditorIcons]] object are optional if the specific panels that use them aren't being included in the application. Some icon components insist on placing their icons within padding, so this needs to be accounted for in the `padding` value associated with head and foot styles.

<fieldset>
<legend>DefaultIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../packages/client-react/src/Components/Editor/EditorIcons/DefaultIcons.tsx&stripImports=1&stripExports=1) -->

```tsx
const DefaultIcons: EditorIcons = {
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
  --preview-width: 480px;
  --preview-height: 270px;
  --scrubber-height: 16px;
  --inspector-width: 240px;
  --track-width: 34px;
  --track-height: 120px;
  --icon-size: 24px;
  --button-size: 24px;
  --border-size: 1px;
  --border: var(--border-size) solid var(--back-tertiary);
  --border-radius: 5px;
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

.moviemasher .editor .panel {
  overflow: hidden;
  display: grid;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  grid-template-columns: 1fr;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--back-primary);
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
  font-size: 0.875rem;
  font-weight: 500;
  border: var(--border);
  border-radius: var(--border-radius);
  color: var(--fore-secondary-promote);
  border-color: var(--fore-secondary-promote);
  background-color: var(--back-secondary);
}

.moviemasher .editor .icon-button:hover,
.moviemasher .editor .icon-button.selected {
  color: var(--fore-secondary-promote);
  transition: var(--button-transition);
}

.moviemasher .editor .panel button {
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
  width: 0.75rem;
  height: 0.75rem;
  margin: 0px 5px;
}

.moviemasher .editor input {
  width: 100%;
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
  grid-template-columns: repeat(auto-fit, var(--icon-size));
  overflow: hidden;
}

.moviemasher .editor .panel.browser .head .selected:hover {
  color: var(--fore-secondary);
}

.moviemasher .editor .panel.browser .foot {
  grid-template-columns: min-content 1fr min-content;
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
.moviemasher .editor .timeline .track-icon {
  background-color: var(--back-secondary);
  color: var(--fore-secondary);
  display: grid;
}

.moviemasher .editor .timeline {
  isolation: isolate;
  grid-area: timeline;
}

.moviemasher .editor .timeline .head {
  grid-template-columns: repeat(7, auto) 1fr min-content;
}

.moviemasher .editor .timeline .content {
  position: relative;
  overflow: auto;
  display: grid;
  grid-template-areas: "scrubber-icon scrubber" "tracks-icon tracks";
  grid-template-columns: var(--track-width) 1fr;
  grid-template-rows: var(--scrubber-height) 1fr;
}

.moviemasher .editor .timeline .scrub-pad,
.moviemasher .editor .timeline .scrub {
  background-color: var(--back-secondary);
  border-bottom: var(--border);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.moviemasher .editor .timeline .scrub-pad {
  grid-area: scrubber-icon;
  z-index: 2;
}

.moviemasher .editor .timeline .scrub {
  grid-area: scrubber;
  z-index: 3;
}

.moviemasher .editor .timeline .scrub-bar-container {
  pointer-events: none;
  position: relative;
  grid-area: tracks;
  z-index: 4;
}

.moviemasher .editor .timeline .scrub-bar {
  width: 1px;
  top: 0px;
  bottom: 0px;
}

.moviemasher .editor .timeline .scrub-icon {
  margin-left: calc(0px - (var(--scrubber-height) / 2));
  width: var(--scrubber-height);
  height: var(--scrubber-height);
  clip-path: polygon(3px 3px, calc(100% - 3px) 3px, 50% calc(100% - 3px));
}
.moviemasher .editor .timeline .scrub-bar,
.moviemasher .editor .timeline .scrub-icon {
  position: absolute;
  background-color: var(--color-fore-secondary);
}


.moviemasher .editor .timeline .tracks {
  grid-area: tracks;
  grid-column-start: tracks-icon;
}

.moviemasher .editor .timeline .foot {
  grid-template-columns: 50% repeat(auto-fill, var(--button-size));
}

.moviemasher .editor .timeline-sizer {
  pointer-events: none;
  position: absolute;
  left: var(--track-width);
  right: 0px;
  top: var(--scrubber-height);
  bottom: 0px;
}


.moviemasher .editor .timeline .track {
  display: grid;
  grid-template-columns: var(--track-width) 1fr;
  border-bottom: var(--border);
  height: var(--track-height);
  overflow-y: hidden;
}

.moviemasher .editor .timeline .track-icon {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
}

.moviemasher .editor .timeline .track-icon svg {
  margin: auto;
}

.moviemasher .editor .timeline .clips {
  white-space: nowrap;
  margin-block: auto;
}

.moviemasher .editor .timeline .clips,
.moviemasher .editor .timeline .clip {
  height: calc(var(--track-height) - (2 * var(--padding)));
}

.moviemasher .editor .timeline .clips .clip {
  border: var(--border);
  border-radius: var(--border-radius);
  overflow-x: hidden;
  background-size: cover;
  background-image: var(--clip-icon);
  padding: 0px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;

  border-color: var(--fore-secondary);
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
}

.moviemasher .editor .timeline .clips .clip:hover,
.moviemasher .editor .timeline .clips .selected {
  color: var(--color-fore-secondary);
  border-color: var(--color-fore-secondary);
  background-color: var(--color-back-secondary);
}

.moviemasher .editor .timeline .clips .selected:hover {
  color: var(--color-fore-tertiary);
  border-color: var(--color-fore-tertiary);
  background-color: var(--color-back-tertiary);
}

.moviemasher .editor .timeline .clip label {
  display: inline-block;
  width: 100%;
  background-color: var(--back-primary);
  opacity: 0.75;
  height: calc(var(--icon-size) + var(--spacing));
}

.moviemasher .editor .timeline .clip label:after {
  content: var(--clip-label);
  padding: var(--spacing);
  display: inline-block;
}


.moviemasher .editor .timeline .drop {
  background-color: var(--color-back-secondary);
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
  grid-template-columns: 1fr 1fr;
}

.moviemasher .editor .panel.player .foot {
  grid-template-columns: var(--icon-size) 1fr 1fr;
}

.moviemasher .editor .panel.player .content {
  background: repeating-conic-gradient(
    var(--back-secondary) 0% 25%, transparent 0% 50%
  ) 50% / 20px 20px;
  background-position: top left;
  width: var(--preview-width);
  height: var(--preview-height);
  margin-inline: auto;
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

.moviemasher .editor .panel.inspector summary,
.moviemasher .editor .panel.inspector label {
  text-transform: capitalize;
}

.moviemasher .editor .panel.inspector label:after {
  content: ': ';
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


.moviemasher .editor .panel.inspector .drop {
  background-color: var(--color-back-secondary);
}
```
<!-- MAGIC:END -->
</fieldset>
