Modern CSS techniques like flex, grid, and variables provide a relatively simple means
to powerfully affect the graphical appearance of the Editor.

CSS variables are used extensively within declarations to avoid repetition and allow nested components to elegantly override styling. Typically the coloring and sizing of all elements can be effectively controlled by overridding just a few variables. The `grid-template-*` properties are utilized to layout the main panels in an intuitive way.

If only a few changes are needed, it's typically easiest to just redefine select styles, as demonstrated in the [README](index.html#Client%20Example). For more elaborate changes, you may want to generate your own CSS file. The one used in the demos is a concatenation of all the files in the _packages/theme-default/dev/css_ directory, which are explored here.

## Icons

The [[MasherDefaultProps]] function supports an `icons` property in its argument object, of type [[EditorIcons]]. If undefined, the [[DefaultIcons]] constant object is used by default. This includes a small subset of the
[remixicon-react](https://www.npmjs.com/package/remixicon-react) components related to media playback and editing. These ultimately compile as SVG elements with their `fill` attributes set to 'currentColor' so they are rendered in the parent's text color.

Most any SVG or font-based icons should work. Properties in the [[EditorIcons]] object are optional if the specific panels that use them aren't being included in the application. Some icon components insist on placing their icons within padding, so this needs to be accounted for in the `padding` value associated with head and foot styles.

<fieldset>
<legend>DefaultIcons.tsx</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/src/Icons.tsx&stripImports=1) -->

```tsx
const MMWideIcon = () => {
  return <svg width="2em" height="1em" viewBox="0 0 48 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0.00 0.00 L 48.00 0.00 L 48.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="none" />
    <path d="M 9.16 2.00 C 8.62 2.00 8.13 2.18 7.73 2.57 L 7.73 2.57 L 1.19 8.91 C 0.77 9.34 0.55 9.82 0.53 10.39 L 0.53 10.39 C 0.53 10.91 0.72 11.37 1.13 11.76 L 1.13 11.76 C 1.56 12.15 2.05 12.31 2.60 12.28 L 2.60 12.28 C 3.17 12.31 3.64 12.13 4.03 11.70 L 4.03 11.70 L 9.16 6.90 L 13.67 11.28 C 14.33 11.87 14.67 12.20 14.73 12.24 L 14.73 12.24 C 15.12 12.63 15.60 12.81 16.14 12.81 L 16.14 12.81 C 16.69 12.85 17.20 12.66 17.63 12.28 L 17.63 12.28 C 17.67 12.26 18.01 11.93 18.63 11.28 L 18.63 11.28 C 19.29 10.65 20.07 9.93 20.93 9.12 L 20.93 9.12 C 21.82 8.23 22.57 7.51 23.20 6.90 L 23.20 6.90 L 31.34 14.86 C 31.74 15.25 32.21 15.47 32.72 15.51 L 32.72 15.51 L 38.29 15.51 L 38.23 19.10 L 44.00 13.55 L 38.29 7.90 L 38.29 11.54 L 33.65 11.48 L 24.63 2.63 C 24.22 2.28 23.74 2.09 23.20 2.09 L 23.20 2.09 C 22.65 2.07 22.16 2.24 21.71 2.63 L 21.71 2.63 L 16.20 8.01 L 11.64 3.63 C 10.98 2.96 10.64 2.61 10.60 2.57 L 10.60 2.57 C 10.18 2.18 9.75 2.00 9.28 2.00 L 9.28 2.00 C 9.24 2.00 9.20 2.00 9.16 2.00" stroke="none" fill="currentColor"  />
    <path d="M 7.70 11.61 L 2.58 16.53 L 0.00 14.05 L 0.00 21.91 L 8.15 21.91 L 5.49 19.38 C 5.53 19.38 5.56 19.36 5.60 19.32 L 5.60 19.32 L 9.19 15.88 L 14.75 21.28 C 15.14 21.67 15.62 21.85 16.16 21.85 L 16.16 21.85 C 16.73 21.89 17.22 21.72 17.65 21.33 L 17.65 21.33 L 23.16 15.88 L 28.78 21.43 C 29.18 21.78 29.67 21.96 30.21 21.96 L 30.21 21.96 L 34.34 22.00 C 34.93 21.98 35.42 21.78 35.83 21.43 L 35.83 21.43 C 36.23 21.04 36.44 20.56 36.44 19.95 L 36.44 19.95 C 36.44 19.39 36.23 18.91 35.83 18.53 L 35.83 18.53 C 35.46 18.17 34.99 18.01 34.40 18.01 L 34.40 18.01 L 31.10 17.95 L 24.65 11.67 C 24.25 11.32 23.76 11.13 23.22 11.13 L 23.22 11.13 C 22.67 11.11 22.18 11.28 21.75 11.67 L 21.75 11.67 L 16.16 16.99 L 10.56 11.61 C 10.15 11.22 9.69 11.04 9.19 11.04 L 9.19 11.04 C 8.64 11.04 8.15 11.22 7.70 11.61" stroke="none" fill="currentColor"  />
  </svg>
}

const MMIcon = () => {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="none" />
    <path d="M 4.20 11.29 L 1.41 13.99 L 0.00 12.63 L 0.00 16.95 L 4.44 16.95 L 2.99 15.56 C 3.01 15.56 3.03 15.55 3.06 15.53 L 3.06 15.53 L 5.01 13.64 L 8.04 16.60 C 8.26 16.82 8.52 16.92 8.82 16.92 L 8.82 16.92 C 9.13 16.94 9.39 16.85 9.63 16.63 L 9.63 16.63 L 12.63 13.64 L 15.70 16.68 C 15.91 16.88 16.18 16.98 16.48 16.98 L 16.48 16.98 L 18.73 17.00 C 19.05 16.99 19.32 16.88 19.55 16.68 L 19.55 16.68 C 19.76 16.47 19.88 16.21 19.88 15.87 L 19.88 15.87 C 19.88 15.57 19.76 15.30 19.55 15.09 L 19.55 15.09 C 19.34 14.90 19.08 14.80 18.76 14.80 L 18.76 14.80 L 16.96 14.77 L 13.45 11.32 C 13.23 11.12 12.96 11.02 12.66 11.02 L 12.66 11.02 C 12.37 11.01 12.10 11.10 11.86 11.32 L 11.86 11.32 L 8.82 14.25 L 5.76 11.29 C 5.53 11.07 5.29 10.97 5.01 10.97 L 5.01 10.97 C 4.71 10.97 4.44 11.07 4.20 11.29 M 5.00 6.00 C 4.70 6.00 4.43 6.10 4.22 6.32 L 4.22 6.32 L 0.65 9.80 C 0.42 10.04 0.30 10.30 0.29 10.62 L 0.29 10.62 C 0.29 10.90 0.39 11.15 0.62 11.37 L 0.62 11.37 C 0.85 11.58 1.12 11.67 1.42 11.65 L 1.42 11.65 C 1.73 11.67 1.98 11.57 2.20 11.34 L 2.20 11.34 L 5.00 8.69 L 7.46 11.10 C 7.82 11.43 8.00 11.61 8.03 11.63 L 8.03 11.63 C 8.25 11.85 8.51 11.95 8.81 11.95 L 8.81 11.95 C 9.10 11.97 9.38 11.87 9.62 11.65 L 9.62 11.65 C 9.64 11.64 9.82 11.46 10.16 11.10 L 10.16 11.10 C 10.52 10.76 10.95 10.36 11.42 9.91 L 11.42 9.91 C 11.90 9.43 12.31 9.03 12.65 8.69 L 12.65 8.69 L 17.10 13.08 C 17.31 13.29 17.57 13.41 17.85 13.43 L 17.85 13.43 L 20.88 13.43 L 20.85 15.40 L 24.00 12.35 L 20.88 9.24 L 20.88 11.25 L 18.35 11.21 L 13.43 6.35 C 13.21 6.15 12.95 6.05 12.65 6.05 L 12.65 6.05 C 12.35 6.04 12.09 6.13 11.84 6.35 L 11.84 6.35 L 8.84 9.30 L 6.35 6.89 C 5.99 6.53 5.80 6.34 5.78 6.32 L 5.78 6.32 C 5.55 6.10 5.32 6.00 5.06 6.00 L 5.06 6.00 C 5.04 6.00 5.02 6.00 5.00 6.00" stroke="none" fill="currentColor" />
  </svg>
}
const MMTubeIcon = () => {
  return <svg width="1em" height="1em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="tube-m-m">
        <path d="
          M 3.60 21.00 C 1.61 21.00 0.00 19.39 0.00 17.40 L 0.00 6.60 C 0.00 4.61 1.61 3.00 3.60 3.00 L 20.40 3.00 C 22.39 3.00 24.00 4.61 24.00 6.60 L 24.00 17.40 C 24.00 19.39 22.39 21.00 20.40 21.00 Z M 3.60 21.00
          M 5.57 11.81 L 3.03 14.30 L 1.75 13.04 L 1.75 17.03 L 5.79 17.03 L 4.47 15.75 C 4.49 15.75 4.51 15.74 4.53 15.72 L 4.53 15.72 L 6.30 13.97 L 9.06 16.71 C 9.26 16.91 9.49 17.00 9.76 17.00 L 9.76 17.00 C 10.04 17.02 10.28 16.94 10.50 16.74 L 10.50 16.74 L 13.23 13.97 L 16.01 16.79 C 16.21 16.96 16.45 17.06 16.72 17.06 L 16.72 17.06 L 18.77 17.08 C 19.06 17.07 19.30 16.96 19.51 16.79 L 19.51 16.79 C 19.70 16.59 19.81 16.35 19.81 16.04 L 19.81 16.04 C 19.81 15.75 19.70 15.51 19.51 15.31 L 19.51 15.31 C 19.32 15.14 19.09 15.05 18.80 15.05 L 18.80 15.05 L 17.16 15.02 L 13.97 11.83 C 13.77 11.65 13.53 11.56 13.26 11.56 L 13.26 11.56 C 12.99 11.55 12.74 11.64 12.53 11.83 L 12.53 11.83 L 9.76 14.54 L 6.99 11.81 C 6.78 11.61 6.56 11.51 6.30 11.51 L 6.30 11.51 C 6.03 11.51 5.79 11.61 5.57 11.81
          M 6.29 6.93 C 6.02 6.93 5.78 7.02 5.58 7.22 L 5.58 7.22 L 2.34 10.43 C 2.14 10.65 2.02 10.89 2.01 11.18 L 2.01 11.18 C 2.01 11.45 2.11 11.68 2.31 11.88 L 2.31 11.88 C 2.53 12.08 2.77 12.16 3.04 12.14 L 3.04 12.14 C 3.32 12.16 3.56 12.07 3.75 11.85 L 3.75 11.85 L 6.29 9.41 L 8.53 11.64 C 8.85 11.94 9.02 12.10 9.05 12.12 L 9.05 12.12 C 9.25 12.32 9.48 12.41 9.75 12.41 L 9.75 12.41 C 10.02 12.43 10.27 12.34 10.49 12.14 L 10.49 12.14 C 10.51 12.13 10.68 11.96 10.98 11.64 L 10.98 11.64 C 11.31 11.32 11.70 10.95 12.12 10.54 L 12.12 10.54 C 12.56 10.09 12.94 9.72 13.25 9.41 L 13.25 9.41 L 17.28 13.46 C 17.48 13.65 17.71 13.76 17.97 13.78 L 17.97 13.78 L 20.72 13.78 L 20.69 15.60 L 23.55 12.79 L 20.72 9.92 L 20.72 11.77 L 18.42 11.74 L 13.96 7.24 C 13.75 7.07 13.52 6.97 13.25 6.97 L 13.25 6.97 C 12.98 6.96 12.73 7.05 12.51 7.24 L 12.51 7.24 L 9.78 9.97 L 7.52 7.75 C 7.19 7.41 7.02 7.24 7.00 7.22 L 7.00 7.22 C 6.80 7.02 6.58 6.93 6.35 6.93 L 6.35 6.93 C 6.33 6.93 6.31 6.93 6.29 6.93
        " />
      </clipPath>
    </defs>
    <path clipPath="url(#tube-m-m)" d="M 0.00 0.00 L 24.00 0.00 L 24.00 24.00 L 0.00 24.00 Z M 0.00 0.00" stroke="none" fill="currentColor" />
  </svg>
}

export const Icons: ThemeIcons = {
  active: <ImSpinner3 key='active' />,
  activity: <TbActivityHeartbeat key='activity' />,
  add: <RiAddLine key='add' />,
  administrator: <RiUserSettingsFill key='administrator' />,
  app: <img key='logo' src="mm.svg" />,
  audible: <RiVolumeUpLine key='audible' />,
  audio: <RiMusicLine key="audio" />,
  broadcast: <RiBroadcastFill key='broadcast' />,
  browser: <MdPermMedia key='browser' />,
  browserAudio: <RiMusic2Fill key="browserAudio" />,
  browserAudioStream: <RiChatVoiceFill key="browserAudioStream" />,
  browserEffect: <MdInvertColors key="browserEffect" />,
  browserImage: <RiImageFill key="browserImage" />,
  browserShape: <BiShapeTriangle key="browserShape" />,
  browserText: <MdOutlineTextFields key="browserText" />,
  browserVideo: <RiFilmFill key="browserVideo" />,
  browserVideoStream: <RiVideoChatFill key="browserVideoStream" />,
  chat: <RiChat3Fill key='chat' />,
  clip: <MdOutlineTimelapse key="clip" />,
  collapse: <VscTriangleDown key="collapse" />,
  collapsed: <VscTriangleRight key="collapsed" />,
  color: <IoMdColorFill key="color" />,
  complete: <FaRegCheckCircle key='complete' />,
  composer: <GiDirectorChair key='composer' />,
  container: <BiBorderOuter key="container" />,
  content: <BiBorderInner key="content" />,
  document: <IoDocument key="document" />,
  end: <BsSkipEndFill key="end" />,
  endUndefined: <BsSkipEnd key="endUndefined" />,
  gain: <RiVolumeUpLine key="gain" />,
  error: <FaExclamationCircle key='error' />,
  folder: <RiFolderLine key='folder' />,
  folderAdd: <RiFolderAddFill key='folderAdd' />,
  folderOpen: <RiFolderOpenLine key='folderOpen' />,
  frame: <TbArrowBarRight key="frame" />,
  frames: <TbArrowBarToRight key="frames" />,
  height: <TbArrowAutofitHeight key="height" />,
  horz: <GiHorizontalFlip key="horz-flip" />,
  inaudible: <RiVolumeMuteLine key='inaudible' />,
  inspector: <RiEdit2Fill key='inspector' />,
  invisible: <RiEyeOffLine key='invisible' />,
  label: <MdLabel key="label" />,
  lock: <HiLockClosed key="lock" />,
  matte: <BsReverseLayoutSidebarInsetReverse key="matte" />,
  message: <RiMessage3Fill key='message' />,
  mm: <MMIcon key="mm" />,
  mmTube: <MMTubeIcon key="mmTube" />,
  mmWide: <MMWideIcon key="mmWide" />,
  opacity: <MdOpacity key="opacity" />,
  playerPause: <RiPauseCircleFill key="player-pause" />,
  playerPlay: <RiPlayCircleFill key="player-play"/>,
  point: <GiMove key="point" />,
  redo: <RiArrowGoForwardLine key="redo" />,
  muted: <RiVolumeMuteLine key="muted" />,
  remove: <RiDeleteBin7Line key="remove" />,
  render: <ImFileVideo key="render" />,
  size: <GiResize key="size" />,
  sizing: <BsAspectRatioFill key="sizing" />,
  start: <BsSkipStartFill key="start" />,
  streamers: <FaUserCircle key='streamers' />,
  timeline: <MdOutlineTimelapse key='timeline' />,
  timing: <AiOutlineColumnWidth key="timing" />,
  startTrim: <CgArrowLongRightL key="start-trim" />,
  speed: <MdOutlineSpeed key="speed" />,
  endTrim: <CgArrowLongLeftL key="end-trim" />,
  track: <RiStackLine key="track" />,
  trackDense: <RiStackFill key="track-dense"/>,
  undo: <RiArrowGoBackLine key="undo" />,
  unlock: <HiLockOpen key="unlock" />,
  upload: <TbFileImport key="upload" />,
  vert: <GiVerticalFlip key="vert" />,
  video: <RiArrowRightSLine key="video" />,
  view: <HiEye key="view" />,
  visible: <RiEyeLine key='visible' />,
  width: <TbArrowAutofitWidth key="width" />,
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

<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/colors.css&stripComments=1) -->

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

<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/sizes.css&stripComments=1) -->

```css
.moviemasher .editor {
  --padding: 40px;
  --spacing: 20px;
  --header-height: 38px;
  --footer-height: 38px;
  --preview-aspect-ratio: 16 / 9;
  --icon-ratio: 0.25;
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
  --dropping-shadow: 
    var(--drop-size) var(--drop-size) 0 0 var(--color-drop) inset,
    calc(-1 * var(--drop-size)) calc(-1 * var(--drop-size)) 0 0 var(--color-drop) inset;
  ;
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
  --padding: 0px;
  --spacing: 5px;
}



.moviemasher .editor .panel.activity .content {
  --padding: 10px;
  --spacing: 5px;
}

.moviemasher .editor .panel .preview label {
  --padding: 5px;
}

.moviemasher .editor .panel button {
  --padding: 5px;
  --spacing: 5px;
}
```
<!-- MAGIC:END -->
</fieldset>

## Layout

<fieldset>
<legend>layout.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/layout.css&stripComments=1) -->

```css
.moviemasher .masher {
  grid-template-areas:
    "player browser panels"
    "timeline timeline panels";
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


.moviemasher .editor .panels {
  grid-area: panels;
	display: flex;
  flex-direction: column;
	gap: var(--spacing);
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

.moviemasher .editor .panel .content .drop-box {
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
}

.moviemasher .editor .panel .content.dropping .drop-box {
  box-shadow: var(--dropping-shadow);
}

.moviemasher .editor .panel.collapsed {
  grid-template-rows: var(--header-height);
  flex-grow: 0;
}

.moviemasher .editor .panel .head {
  border-bottom: var(--border);
  padding: var(--padding);
  column-gap: var(--spacing);
  display: grid;
}

.moviemasher .editor .panel .foot {
  border-top: var(--border);
  padding: var(--padding);
  column-gap: var(--spacing);
  display: flex;
}

.moviemasher .editor .panel .foot,
.moviemasher .editor .panel .head {
  background-color: var(--back-secondary);
  color: var(--fore-secondary);
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


.moviemasher .editor .panel .preview {
  position: relative;
  overflow: hidden;
  border: var(--border);
  border-radius: var(--border-radius);
  border-color: var(--fore-secondary);
  color: var(--fore-secondary);
  background-color: var(--back-secondary);
}
.moviemasher .editor .panel .preview > * {
  pointer-events: none;
}


.moviemasher .editor .panel .preview label {
  position: absolute;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  background-color: var(--back-primary);
  opacity: 0.5;
  height: calc(var(--icon-size));
  padding: var(--padding);
}

.moviemasher .editor label {
  height: var(--icon-size);
}

.moviemasher .editor .panel select {
  height: var(--button-size);
}
```
<!-- MAGIC:END -->
</fieldset>

## Editor

<fieldset>
<legend>editor.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/editor.css&stripComments=1) -->

```css
.moviemasher .editor {
  user-select: none;
  -webkit-user-select: none;
}

.moviemasher .editor .panel button {
  display: inline-flex;
  gap: var(--spacing);
  padding: var(--padding);
  align-items: center;
  min-width: var(--button-size);
  font-size: calc(var(--button-size) - 2 * var(--spacing));
  line-height: calc(var(--button-size) - 2 * var(--spacing));
  height: var(--button-size);
  cursor: pointer;
  appearance: none;
  outline: none;
  font-weight: 500;
  border: var(--border);
  border-radius: var(--border-radius);

  color: var(--fore-secondary-promote);
  border-color: var(--fore-secondary-promote);

  background-color: var(--back-secondary);
  transition: var(--button-transition);
}

.moviemasher .editor .button {
  cursor: pointer;
  height: var(--button-size);
  font-size: var(--button-size);
  line-height: var(--button-size);
  transition: var(--button-transition);
}


.moviemasher .editor .panel button:hover {
  color: var(--fore-secondary);
  border-color: var(--fore-secondary);
}

.moviemasher .editor .button:hover,
.moviemasher .editor .button.selected {
  color: var(--fore-secondary-promote);
}

.moviemasher .editor .button.disabled:hover,
.moviemasher .editor .button.disabled,
.moviemasher .editor .panel button:disabled {
  cursor: default;
  color: var(--fore-secondary-demote);
  border-color: var(--fore-secondary-demote);
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
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/browser.css&stripComments=1) -->

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

.moviemasher .editor .panel.browser .foot label {
  text-align: right;
  flex-grow: 1;
}
.moviemasher .editor .panel.browser .foot label:hover {
  color: var(--fore-secondary-promote);
}

.moviemasher .editor .panel.browser .dropping {
  box-shadow: var(--dropping-shadow);
}

.moviemasher .editor .panel.browser .content {
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(var(--preview-width) * var(--icon-ratio)));
  grid-auto-rows: calc(var(--preview-height) * var(--icon-ratio));
  gap: var(--spacing);
  overflow-y: auto;
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
```
<!-- MAGIC:END -->
</fieldset>

## Timeline Panel

<fieldset>
<legend>timeline.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/timeline.css&stripComments=1) -->

```css
.moviemasher .editor .panel.timeline {
  isolation: isolate;
  grid-area: timeline;
}


.moviemasher .editor .panel.timeline .head {
  grid-template-columns: 1fr repeat(6, auto) 1fr min-content;
}

.moviemasher .editor .panel.timeline .content {
  overflow: auto;
  overscroll-behavior: none;
  display: grid;
  grid-template-columns: var(--track-width) 1fr;
  grid-template-rows: var(--scrubber-height) repeat(auto-fill, var(--track-height));
  row-gap: var(--spacing);
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
  cursor:pointer;
  background-color: var(--color-fore-secondary);
  transition: var(--button-transition);
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

.moviemasher .editor .panel.timeline .content .disabled .scrubber-element-bar,
.moviemasher .editor .panel.timeline .content .disabled .scrubber-element-icon {
  pointer-events: none;
  cursor: default;
  background-color: var(--fore-secondary-demote);
}

.moviemasher .editor .panel.timeline .content .drop-box {
  top: var(--scrubber-height);
  left: var(--track-width);
}

.moviemasher .editor .panel.timeline .content .track {
  padding: var(--padding);
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
  border-block: none;
  display: inline-block;
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
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/player.css&stripComments=1) -->

```css
.moviemasher .editor .panel.player {
  grid-area: player;
}

.moviemasher .editor .panel.player .head {
  grid-auto-flow: column;
  grid-template-columns: 1fr repeat(2, min-content);
}

.moviemasher .editor .panel.player .foot .time {
  font-size: 0.75em;
  text-align: right;
  flex-grow: 1;
}


.moviemasher .editor .panel.player .content {
  width: var(--preview-width);
  height: var(--preview-height);
  margin-inline: auto;
  color: var(--color-fore-tertiary);
  position: relative;
}

.moviemasher .editor .panel.player .content > .svgs {
  position: relative;
}
.moviemasher .editor .panel.player .content > .svgs > svg {
  position: absolute;
  left: 0px;
  top: 0px;
  pointer-events: none;
}



.moviemasher .editor .panel.player .content > .svgs > svg .outline {
  cursor: move;
  pointer-events: fill;
  stroke-width: 0;
  fill: transparent;
}

.moviemasher .editor .panel.player .content > .svgs > svg .outline.animate:hover {
  stroke-width: calc(2 * var(--border-size));
  stroke-dasharray: 4px;
  stroke-dashoffset: 8px;
  stroke: white;
  animation: 
    stroke 1s linear infinite forwards,
    color 1s linear 0.5s infinite alternate;
}

@keyframes color { to {  stroke: black } }
@keyframes stroke { to { stroke-dashoffset: 0; } }


.moviemasher .editor .panel.player .content > .svgs > svg .bounds.back {
  stroke-width: calc(2 * var(--border-size));
  stroke: black;
}

.moviemasher .editor .panel.player .content > .svgs > svg .bounds.fore {
  pointer-events: none;
  stroke: none;
  fill: white;
}
```
<!-- MAGIC:END -->
</fieldset>

## Inspector Panel

<fieldset>
<legend>inspector.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../packages/theme-default/dev/css/inspector.css&stripComments=1) -->

```css
.moviemasher .editor .panel.inspector {
  grid-area: inspector;
  flex-grow: 1;
}

.moviemasher .editor .panel.inspector .content fieldset {
  line-height: var(--icon-size);
  font-size: var(--icon-size);
  padding: var(--spacing);
  background-color: initial;
}
.moviemasher .editor .panel.inspector .content .start-end {
  display: flex;
  float: right;
}
.moviemasher .editor .panel.inspector .content fieldset > legend {
  width: 100%;
}
.moviemasher .editor .panel.inspector .content fieldset > legend > div {
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

.moviemasher .editor .panel.inspector .content fieldset > div.timing {
  grid-template-columns: var(--icon-size) minmax(50px, 1fr);
}

.moviemasher .editor .panel.inspector .content fieldset > div.point {
  grid-template-columns: repeat(2, var(--icon-size)) minmax(50px, 1fr) var(--icon-size);
}

.moviemasher .editor .panel.inspector .content {
  overflow-y: auto;
  padding: var(--padding);
}

.moviemasher .editor .panel.inspector .content>* {
  margin-bottom: var(--spacing);
}
.moviemasher .editor .panel.inspector .content > .row {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing);
  grid-template-columns: var(--icon-size) 1fr;
  line-height: var(--icon-size);
  font-size: var(--icon-size);
}


.moviemasher .editor .panel.inspector .content > .row input {
  min-width: 20px;
}

.moviemasher .editor .panel.inspector .content > .row.tween {
  grid-template-columns: var(--icon-size) minmax(50px, 1fr) min-content;
}

.moviemasher .editor .panel.inspector .content > div > label,
.moviemasher .editor .panel.inspector .content > div > button {
  margin-right: var(--spacing);
}

.moviemasher .editor .panel.inspector .effects .list {
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
  aspect-ratio: var(--preview-aspect-ratio);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--spacing);
  color: var(--fore-primary);
  border-color: var(--fore-primary);
  background-color: var(--back-primary);
  height: calc((2 * var(--spacing)) + var(--preview-height) * var(--icon-ratio));
}

.moviemasher .editor .panel.inspector .effects .list .effect {
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

.moviemasher .editor .panel.inspector .effects .list .effect:hover,
.moviemasher .editor .panel.inspector .effects .list .selected {
  color: var(--color-fore-secondary);
  border-color: var(--color-fore-secondary);
  background-color: var(--color-back-secondary);
}

.moviemasher .editor .panel.inspector .effects .list .selected:hover {
  color: var(--color-fore-tertiary);
  border-color: var(--color-fore-tertiary);
  background-color: var(--color-back-tertiary);
}


.moviemasher .editor .panel.inspector .dropping {
  box-shadow: var(--dropping-shadow);
}
```
<!-- MAGIC:END -->
</fieldset>
