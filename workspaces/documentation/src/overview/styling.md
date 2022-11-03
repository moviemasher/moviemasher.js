Movie Masher supports several powerful mechanisms to change the appearance of the editing interface without adjusting the React components themselves, as described in the [Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html). Most components render their HTML elements with a `class` attribute, so styling is fairly straightforward. Graphical elements like icons are represented as SVG elements, with their `fill` attributes set to 'currentColor' so they are rendered in its parent's text color.

While Movie Masher does bundle what could be discreet SVG files into React components that instead render SVG elements, it does not attempt to do the same with CSS rules. These are currently bundled into a dedicated CSS file and imported via a LINK element in the HEAD, instead of any JavaScript-based alternative. This may change as web components are more fully supported. 

## Themes

A Movie Masher theme package contains a collection of SVG icons utilized in the editing interface, as well as CSS rules that control layout and styling of its components. 
The [Default Theme](https://www.npmjs.com/package/@moviemasher/theme-default) package exports just a single `Icons` object with values containing a small subset of the 
[React Icons](https://react-icons.github.io/react-icons/) components related to media playback and editing. The package also contains a file at _/moviemasher.css_ containing CSS defining all coloring and sizing rules, which is a concatenation of all the files in the _/src/css_ directory.

## Icons

The [[MasherDefaultProps]] function in the [React Client](https://www.npmjs.com/package/@moviemasher/client-react) package supports an `icons` property in its argument object which defaults to the `Icons` object from the default theme. This is passed to similar `*DefaultProps` functions and stored in the [[MasherContext]] for use by more dynamic components. Properties in the object are optional, so uneeded if the specific components that use them aren't ultimately being included in the interface. 

Here's an example of overriding a single icon with a PNG image:

<fieldset>
<legend>masher.tsx</legend>

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-react"
import { Icons } from "@moviemasher/theme-default"

const AppIcon = () => <img src='app-icon.png'> 

const element = document.getElementById('app')!
const options = { icons: { ...Icons, app: <AppIcon key='app'> } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
ReactDOM.createRoot(element).render(editor)
```

</fieldset>

It's important to include a unique `key` attribute in your component instance since multiple icons often render as siblings. If your component returns an SVG node it should have a proper `viewBox` attribute, and its `fill` attribute set to 'currentColor' to be styled with the current `color` inherited from its parent. 

## CSS

Modern CSS techniques like flex, grid, and variables provide a relatively simple means to powerfully affect the graphical appearance of the Editor.

CSS variables are used extensively within declarations to avoid repetition and allow nested components to elegantly override styling. Typically the coloring and sizing of all elements can be effectively controlled by overridding just a few variables. The `grid-template-*` properties are utilized to layout the main panels in an intuitive way.

If only a few changes are needed, it's typically easiest to just redefine select styles. For more elaborate changes, you may want to generate your own CSS file. 


## Coloring

Movie Masher utilizes the HSL color model to generate a flexible palette with wide tonal range from a small collection of variables. It contains twelve core colors which can be broadly categorized as _back_ and _fore_ with _primary_, _secondary_, and _tertiary_ variations. Two additional variations of the secondary foreground color (used in panel headers and footers) are included to _promote_ or _demote_ child components.

It is expected that text or icons painted in a foreground color will always contrast well with the corresponding background color. To achieve this, Movie Masher defines six `lum-*` luminance variables (`primary`, `secondary`, and `tertiary` variations of `back` and `fore`) which are combined with two `hue-*` variables and three `sat-*` saturation variables to produce the dozen core colors.

These HSL variables are not used outside this file, so it's okay to remove them and define the `back-*`, `fore-*`, and `color-*` variables in some other way. The primary benefit to this approach is the ability to specify a different set of `lum-*` variables for both light and dark modes, as we do here.

<fieldset>
<legend>colors.css</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../packages/theme-default/src/css/colors.css&stripComments=1) -->

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

<!-- MAGIC:START (TRIMCODE:src=../../../../packages/theme-default/src/css/sizes.css&stripComments=1) -->

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


.moviemasher .editor .panel.inspector .row .list {
  --padding: 5px;
  --spacing: 2px;  
}

.moviemasher .editor .panel.inspector .content > .row .icons {
  --spacing: 2px;
}
```
<!-- MAGIC:END -->
</fieldset>

## Layout

<fieldset>
<legend>layout.css</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../../packages/theme-default/src/css/layout.css&stripComments=1) -->

```css
.moviemasher .editor.masher {
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

.moviemasher .editor.caster {
  grid-template-areas:
    "player browser panels"
    "composer timeline panels";
  grid-template-columns:
    calc(var(--preview-width) + (var(--border-size) * 2))
    1fr
    var(--inspector-width);
  grid-template-rows:
    calc( var(--preview-height) + var(--header-height) + var(--footer-height))
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
  white-space: nowrap;
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
