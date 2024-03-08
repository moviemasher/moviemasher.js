## Client Developer

The 
[client-lib]()
package provides a front-end video editing user interface, as described in the
[End User Guide](EndUser.html). It is distributed through NPM as
[@moviemasher/client-lib](https://www.npmjs.com/package/@moviemasher/client-lib)
and imports the following packages:

- [shared-lib]()
- [Lit](https://lit.dev/) 

The client library is imported from the browser to facilitate common editing tasks. 
It's intended to be used in conjunction with the [server-lib](server-lib.html)
package, but this is not a requirement - it can be used independently.


## Core Patterns
The library exports and defines scores of 
[custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
classes that inherit from [lit-element](hhttps://www.npmjs.com/package/lit-element).
Once imported, these new tags can be used directly in HTML without requiring
any intermediate build step. They support simple, string-based attributes and 
common web component standards like 
[slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot),
[parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part),
and [variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). Generally, layout and appearance of panels 
is controlled by utilizing these features.

To populate the content of panels and determine the behavior of controls, components dispatch [ClientEvents]() that are handled by other components or underlying libraries. 
This handling can often be customized by simply supplying attribute values to 
components. Complete control is possible by overriding handling of particular
events or by extending components.


<!-- MAGIC:START (FILEMD:src=md/examples/client.md&stripMagic=1) -->
## Client Example

The HTML document below can be hosted on a web server to deliver the Movie Masher application. 
The first SCRIPT element is an 
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
which tells the browser where to import the Movie Masher and Lit modules. 
The second SCRIPT element imports the MOVIE-MASHER custom element, which is then used in the BODY.
<details open>

<summary>example.html</summary>
<hr/>


```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Movie Masher Example</title>
    <script type='importmap'>{
      "imports": {
        "@moviemasher/client-lib/": "https://unpkg.com/@moviemasher/client-lib@5.2.0/dist/", 
        "@moviemasher/shared-lib/": "https://unpkg.com/@moviemasher/shared-lib@5.2.0/dist/",
        "@lit-labs/observers/": "https://unpkg.com/@lit-labs/observers@2.0.0/",
        "@lit/reactive-element": "https://unpkg.com/@lit/reactive-element@1.6.3/reactive-element.js",
        "@lit/reactive-element/": "https://unpkg.com/@lit/reactive-element@1.6.3/",
        "lit-element/": "https://unpkg.com/lit-element@3.3.3/",
        "lit-html": "https://unpkg.com/lit-html@2.8.0/lit-html.js",
        "lit-html/": "https://unpkg.com/lit-html@2.8.0/",
        "lit/": "https://unpkg.com/lit/@2.8.0/"
      }
    }</script>
    <script type='module'>
      import '@moviemasher/client-lib/movie-masher.js';
    </script>
    <style>
      body {
        height: 100vh;
        display: flex;
        margin: 0px;
        padding: 0px;
        font-family: sans-serif;
      }
      @media(prefers-color-scheme: dark) {
        body { background-color: #2d1e05; color: #fff; }
      }
    </style>
  </head>
  <body>
    <movie-masher></movie-masher>
  </body>
</html>
```

</details>

Without additional styling the `MovieMasherElement` element will fill its container both horizontally and vertically, with some padding. In this example we use the STYLE element to define the BODY as an unpadded flex box so it fills the whole viewport. We also use a media query to set a page background color when the user's device is in dark mode (the editor adjusts automatically). 

<!-- MAGIC:END -->

### Slots
Any of the default MOVIE-MASHER child elements can be easily replaced by supplying a new element having
an appropriate `slot` attribute. For instance, the browser content and accompanying chrome
can be entirely replaced with a custom DIV element by using the following HTML:
```html
<movie-masher>
  <div slot='browser'>My Browser...</div>
</movie-masher>
```
A more specific `slot` attribute can be used to replace just the content, header, 
or footer slots:

```html
<movie-masher>
  <div slot='browser-header'>My Browser Header...</div>
  <div slot='browser-content'>My Browser Content...</div>
</movie-masher>
```

The content, header, and footer slots are likewise divided into left, center, and right slots that 
can be replaced by appending to the `slot` attribute:
```html
<movie-masher>
  <div slot='browser-footer-center'>My Browser Footer Elements...</div>
</movie-masher>
```
By default, the center slot is not populated in headers or footers so it's a 
good place to add your elements. The left and right slots are not populated in the content. 

### Spacing and Sizing
The MOVIE-MASHER element defines a number of CSS variables that can be used to 
customize the editor's appearance. For instance, the `--gap` variable determines 
the spacing between each of its elements, while `--pad` sets the padding around 
them all. To set both to five pixels, you could add the following to your CSS:
```css
movie-masher {
  --gap: 5px;
  --pad: 5px;
}
```
Note that only the direct child elements are affected. More specific variables 
can be used to target the content or chrome areas of each child element. For 
instance, override the following variables to set the spacing and padding of both to five pixels:
```css
movie-masher {
  --gap-chrome: 5px;
  --gap-content: 5px;
  --pad-chrome: 5px;
  --pad-content: 5px;
}
``` 
Additionally, the width of borders is controlled by the `--size-border` variable 
and padding around labels in the browser and timeline can be set with 
`--pad-label`. The `--gap-control` and `--pad-control` variables can be used to 
set the spacing and padding around inputs and buttons. Their height is set
by the `--height-control` variable. You'll want this to be less than 
`--height-header` or `--height-footer`. 

The width of the inspector is hardcoded by the `--width-inspector` variable. The 
timeline stretches horizontally to fill the remaining space. The `--size-preview` 
defines the maximum dimension of the player content area - the smaller dimension is 
calculated automatically based on the content being displayed. The browser 
stretches horizontally to fill the remaining space. 

### Coloring

Ten variables control the color of all elements - a set of five for both the content and chrome areas:

- back: background color
- fore: foreground color for text, icons, and borders
- off: disabled color
- on: selected color
- over: hover color

For instance, `--back-chrome` sets the background color of the headers and 
footers, as well as borders. The `--over-chrome` variable sets the color of 
icons, text and button borders in the same areas when they are hovered over.

The defaults for colors are defined in the oklch colorspace. Luminosity 
is based on percentages defined in `--lightness-1` through `--lightness-6`. 
When in dark mode these are replaced by `--darkness-1` through `--darkness-6`. 
Most colors are grayscale, but the 'on' and 'over' colors include the 
`--hue` and `--chroma` variables. 

### CSS Parts

The MOVIE-MASHER element defines a number of CSS parts that can be used to limit 
the scope of variable overrides and other styles. These share the same names as 
the corresponding slots. For instance, the following CSS sets the color of 
icons and buttons in the browser footer to red and increases the gap between them:
```css
movie-masher::part(browser-footer) {
  --fore-chrome: red;
  --gap-chrome: 20px;
}
```

### Custom Icons
```html
<movie-masher icons='icons.json'></movie-masher>
```


## Custom Content
### Browser Assets
### Timeline Clips
### Controls
### Control Groups

## Custom Behavior

### Populating the Video Editor
By default, a new empty video mash is created for editing. This behavior can be 
easily overriden by supplying a URL value for the MOVIE-MASHER element's 
`asset-object` attribute. The JSON returned by the URL can be any valid 
`AssetObject`.
For instance, the following HTML loads a mash from a
JSON file:

```html
<movie-masher asset-object='mash.json'></movie-masher>
```

If it's not a mash asset object, a new one of the same type will 
be loaded instead, containing a clip referencing it. If a more complex 
`EndpointRequest`
is needed or you've already got an asset object to load, you can put it in the 
`assetObject` property of the `MOVIE_MASHER`
`options` object before loading the client library: 

```html
<script type='module'>
  import { MovieMasher } from '@moviemasher/runtime-client';
  MovieMasher.options.assetObject = { 
    type: 'video', source: 'mash',
    id: 'unique-id', color: '#FFFF00',
  };
  import '@moviemasher/client-lib/movie-masher.js';
</script>
```

### Populating the Media Browser
By default, an empty array of assets is supplied to the browser for display, 
which is appeneded to when importing additional media. This behavior can be
easily overriden by supplying a URL value for the MOVIE-MASHER element's 
`asset-objects` attribute. The JSON returned by the URL can be a valid array of 
`AssetObjects`. 
For instance, the following HTML loads static assets from a
JSON file:

```html
<movie-masher asset-objects='assets.json'></movie-masher>
```


Alternatively, a more complex request can be made by adding a 
`RequestObject` to the
`MOVIE_MASHER` global object's 
`options` before loading the client library: 

```html
<script type='module'>
  import { MovieMasher } from '@moviemasher/runtime-client';
  MovieMasher.options.assetObject = { 
    request: { endpoint: 'mash.json' } 
  };
  import '@moviemasher/client-lib/movie-masher.js';
</script>
```

### Saving Assets
### Uploading Media
### Encoding Mash
### Decoding Assets
### Transcoding Assets



