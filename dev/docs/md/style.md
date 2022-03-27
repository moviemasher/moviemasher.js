Modern CSS techniques like flexbox, grid, and variables provide a relatively simple means
to powerfully affect the graphical appearance of the Editor. If only a few changes are
needed, it's typically easiest to just redefine select styles from the CSS file we
included in the HTML file above.

This file is a concatenation of the other files within that directory, shown below.
An alternative approach for more elaborate changes would be to replace one or more
of these files and include them individually.

## Coloring

<fieldset>
<legend>colors.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../css/colors.css&stripComments=1) -->

```css
.moviemasher {
  --back-primary: hsl(0, 0%, 100%);
  --back-secondary: hsl(0, 0%, 90%);
  --back-tertiary: hsl(0, 0%, 85%);
  --fore-primary: #545454;
  --fore-secondary: #2c2c2c;
  --fore-tertiary: #1d1d1d;
  --color-primary: #366db8;
  --color-secondary: #29528b;
  --color-tertiary: #1e3c66;
}

@media (prefers-color-scheme: dark) {
  .moviemasher {
    --back-primary: hsl(0, 0%, 5%);
    --back-secondary: hsl(0, 0%, 10%);
    --back-tertiary: hsl(0, 0%, 15%);
    --fore-primary: #ababab;
    --fore-secondary: #cfcfcf;
    --fore-tertiary: #e9e9e9;
    --color-primary: #476780;
    --color-secondary: #758caa;
    --color-tertiary: #a2c3ee;
  }
}
```
<!-- MAGIC:END -->
</fieldset>

## Sizing

<fieldset>
<legend>sizes.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../css/sizes.css&stripComments=1) -->

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
  --track-height: 84px;
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

## Icons

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

## Positioning

<fieldset>
<legend>layout.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../css/layout.css&stripComments=1) -->

```css
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
.moviemasher .caster {
  grid-template-areas:
    "layers switcher switcher switcher"
    "layers layouts viewer webrtc";
  grid-template-columns:
    var(--inspector-width)
    1fr
    repeat(2, calc(
      var(--preview-width)
      + (var(--border-size) * 2)
    ));
  grid-template-rows:
    1fr
    calc(
      var(--preview-height)
      + var(--header-height)
      + var(--footer-height)
    );

}
.moviemasher .caster .webrtc {
  grid-area: webrtc;
}
.moviemasher .caster .layers {
  grid-area: layers;
}
.moviemasher .caster .switcher {
  grid-area: switcher;
}
.moviemasher .caster .layouts {
  grid-area: layouts;
}
.moviemasher .caster .viewer {
  grid-area: viewer;
}

.moviemasher .viewer .head,
.moviemasher .webrtc .head {
  grid-template-columns: repeat(10, min-content);
  white-space: nowrap;
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

.moviemasher .editor input[type=file] {
  visibility: hidden;
  vertical-align: bottom;
  width: 0px;
}

.moviemasher .editor label {
  height: var(--icon-size);
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

.moviemasher .editor .timeline .track-icon,
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

.moviemasher .editor .panel button:hover {
  color: var(--fore-tertiary);
  border-color: var(--fore-tertiary);
  background-color: var(--back-tertiary);
}

.moviemasher .editor .panel button,
.moviemasher .editor .panel button:disabled {
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
  background-color: var(--back-secondary);
  color: var(--fore-secondary);
  border-color: var(--fore-secondary);
}

.moviemasher .editor .panel button:disabled {
  background-color: var(--back-secondary);
  color: var(--back-primary);
  border-color: var(--back-primary);
}

.moviemasher .editor .panel button {
  transition:
    background-color 0.25s ease-in-out,
    border-color 0.25s ease-in-out,
    color 0.25s ease-in-out;
}

.moviemasher .editor .panel button > svg {
  width: 0.75rem;
  height: 0.75rem;
  margin: 0px 5px;
}

.moviemasher .editor .browser {
  grid-area: browser;
}

.moviemasher .editor .browser .head {
  grid-template-columns: repeat(auto-fit, var(--icon-size));
  overflow: hidden;
}

.moviemasher .editor .browser .content {
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(var(--preview-width) / 3));
  grid-auto-rows: calc(var(--preview-height) / 3);
  gap: var(--spacing);
  overflow-y: auto;
}


.moviemasher .editor .inspector {
  grid-area: inspector;
}

.moviemasher .editor .inspector label {
  text-transform: capitalize;

}

.moviemasher .editor .inspector label:after {
  content: ': ';
}

.moviemasher .editor .inspector .content {
  overflow-y: auto;
  padding: var(--padding);
}

.moviemasher .editor .inspector .content>* {
  margin-bottom: var(--spacing);
}

.moviemasher .editor input {
  width: 100%;
}

.moviemasher .editor .inspector .effects {
  background-color: var(--back-secondary);
  width: 100%;
  height: calc((3 * var(--icon-size)) + (4 * var(--spacing)));
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacing);
}

.moviemasher .editor .inspector .effects .effect {
  color: var(--fore-tertiary);
  background-color: var(--back-tertiary);
  width: 100%;
  height: var(--icon-size);
  border: var(--border);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing);
  padding: var(--border-radius);
}

.moviemasher .editor .timeline {
  isolation: isolate;
  grid-area: timeline;
}

.moviemasher .editor .timeline .head {
  grid-template-columns: repeat(9, auto) 1fr;
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
}

.moviemasher .editor .timeline .scrub-bar {
  position: absolute;
  width: 1px;
  top: 0px;
  bottom: 0px;
  background-color:var(--color-secondary);
}

.moviemasher .editor .timeline .scrub-icon {
  margin-left: calc(0px - (var(--scrubber-height) / 2));
  position: absolute;
  background-color: var(--color-secondary);
  width: var(--scrubber-height);
  height: var(--scrubber-height);
  clip-path: polygon(3px 3px, calc(100% - 3px) 3px, 50% calc(100% - 3px));
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

.moviemasher .editor .browser .definition,
.moviemasher .editor .timeline .clip {
  border: var(--border);
  border-radius: var(--border-radius);
  border-color: var(--fore-secondary);
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
  overflow-x: hidden;
  background-size: cover;
  background-image: var(--clip-icon);
}

.moviemasher .editor .timeline .clip {
  padding: 0px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
}

.moviemasher .editor .timeline .clip label,
.moviemasher .editor .browser .definition label {
  display: inline-block;
  width: 100%;
  background-color: var(--back-tertiary);
  opacity: 0.75;
  height: calc(var(--icon-size) + var(--spacing));
}

.moviemasher .editor .timeline .clip label:after,
.moviemasher .editor .browser .definition label:after {
  content: var(--clip-label);
  padding: var(--spacing);
  display: inline-block;
}

.moviemasher .editor .MuiSvgIcon-root {
  font-size: var(--icon-size);
}

.moviemasher .editor .timeline .scrub .MuiSvgIcon-root {
  font-size: var(--scrubber-height);
}

.moviemasher .editor .MuiSlider-root {
  color: var(--color-primary);
  padding: 11px;
}

.moviemasher .editor .player {
  grid-area: player;
}

.moviemasher .editor .player .foot {
  grid-template-columns: var(--icon-size) 1fr 1fr;
}

.moviemasher .editor .player .content {
  background: repeating-conic-gradient(
    var(--back-secondary) 0% 25%, transparent 0% 50%
  ) 50% / 20px 20px;
  background-position: top left;
  width: var(--preview-width);
  height: var(--preview-height);
  margin-inline: auto;
}

.moviemasher .editor .selected {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
}

.moviemasher .editor .selected:hover {
  color: var(--color-tertiary);
  border-color: var(--color-tertiary);
}

.moviemasher .editor .drop {
  background-color: var(--color-tertiary);
}
```
<!-- MAGIC:END -->
</fieldset>
