## Styling 

Movie Masher supports several powerful mechanisms to change the appearance of the editing interface without adjusting the React components themselves, as described in the [Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html). Most components render their HTML elements with a `class` attribute, so styling is fairly straightforward. Graphical elements like icons are represented as SVG elements, with their `fill` attributes set to 'currentColor' so they are rendered in its parent's text color.

While Movie Masher does bundle what could be discreet SVG files into React components that instead render SVG elements, it does not attempt to do the same with CSS rules. These are currently bundled into a dedicated CSS file and imported via a LINK element in the HEAD, instead of any JavaScript-based alternative. This may change as web components are more fully supported. 

## Themes

A Movie Masher theme package contains a collection of SVG icons utilized in the editing interface, as well as CSS rules that control layout and styling of its components. 
The [Default Theme](https://www.npmjs.com/package/@moviemasher/theme-default) package exports just a single `Icons` object with values containing a small subset of the 
[React Icons](https://react-icons.github.io/react-icons/) components related to media playback and editing. The package also contains a file at _/moviemasher.css_ containing CSS defining all coloring and sizing rules, which is a concatenation of all the files in the _/src/css_ directory.

## Icons

The [[MasherDefaultProps]] function in the [React Client](https://www.npmjs.com/package/@moviemasher/client-lib) package supports an `icons` property in its argument object which defaults to the `Icons` object from the default theme. This is passed to similar `*DefaultProps` functions and stored in the [[MasherContext]] for use by more dynamic components. Properties in the object are optional, so uneeded if the specific components that use them aren't ultimately being included in the interface. 

Here's an example of overriding a single icon with a PNG image:

<fieldset>
<legend>masher.tsx</legend>

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-lib"
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

These HSL variables are not used outside this file, so it's okay to remove them and define the `back-*`, `fore-*`, and `color-*` variables in some other way. The primary benefit to this approach is the ability to specify a different set of `lum-*` variables for both light and dark modes.


The primary background color typically matches the page background color, and is used around and between the panels as well as within their content areas. The secondary background color is used in panel borders, headers, and footers as well as content elements (clips in timeline, effects in inspector, and definitions in browser). The tertiary background color is used to demote in light mode.

The primary foreground color typically matches the page text color, and is used for text labels within the inspector. The secondary foreground color is used for borders and text of content elements, as well as text and icon buttons within headers and footers. The tertiary foreground color is the default for any other text or icons.

The `color-*` variants of these are used to paint selected content elements. During drag operations the background color is used to highlight areas that can potentially be dropped into. The foreground color is used for the timeline scrubber control, and to promote its buttons.

The icon button currently selected in the browser header is painted with the promote foreground color, as are the enabled buttons withing the timeline header. These buttons paint with the demote foreground color when disabled.Generally when something selected is hovered over, the next level of colors is used - for instance tertiary colors are swapped for secondary ones. When something promoted is hovered over, it is temporarily not promoted (but also not demoted) which effectively desaturates the element.
