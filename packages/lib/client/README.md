<!-- MAGIC:START (FILE:src=../../../dev/documentation/snippet/head.md) -->
<!-- The below content is automatically added from ../../../dev/documentation/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

_JavaScript video editor and encoder_
- **edit** video, audio, and images in [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
- **encode** high resolution media files using [FFmpeg](https://ffmpeg.org)
- **customize** the editor with standard [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **extend** the system by listening for [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
<!-- MAGIC:END -->

## Client Library

[Lit](https://lit.dev/) 

## Full Example

The HTML document below can be hosted on a web server to deliver the Movie Masher application. 
The first SCRIPT element is an 
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
which tells the browser where to import the Movie Masher and Lit modules. 
The second SCRIPT element imports the MOVIE-MASHER custom element, which is then used in the BODY.

<!-- MAGIC:START (TRIMCODE:src=dev/documentation/public/example.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Movie Masher Example</title>
    <script type='importmap'>{
      "imports": {
        "@moviemasher/lib-client/": "https://unpkg.com/@moviemasher/lib-client@5.1.2/dist/", 
        "@moviemasher/lib-shared": "https://unpkg.com/@moviemasher/lib-shared@5.1.2/dist/lib-shared.js",
        "@moviemasher/runtime-client": "https://unpkg.com/@moviemasher/runtime-client@5.1.2/index.js",
        "@moviemasher/runtime-shared": "https://unpkg.com/@moviemasher/runtime-shared@5.1.2/index.js",
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
      import '@moviemasher/lib-client/movie-masher.js';
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
<!-- MAGIC:END -->
Without additional styling the [MovieMasherElement]() element will fill its container both horizontally and vertically, with some padding. In this example we use the STYLE element to define the BODY as an unpadded flex box so it fills the whole viewport. We also use a media query to set a page background color when the user's device is in dark mode (the editor adjusts automatically). 

## Customization
By default the MOVIE-MASHER element is populated with several child elements 
that organize editing controls into separate sections (player, browser, 
timeline, inspector). Each of these has a _content_ area  with _chrome_ areas 
(header, footer, border) surrounding them: 

- Player provides a preview of the mash being edited
- Browser displays assets that can be added to the mash
- Timeline displays clips that represent assets in the mash
- Inspector displays controls for editing the mash and its assets

<!-- MAGIC:START (COLORSVG:replacements=black&src=./dev/documentation/svg/masher.svg) -->
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 360" class='diagram'>
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 175.37 L 0.00 175.37 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 460.00 185.00 L 640.00 185.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 228.82 0.00 L 640.00 0.00 L 640.00 175.37 L 228.82 175.37 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 185.00 L 448.54 185.00 L 448.54 360.00 L 0.00 360.00 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"  />
<path d="M 0.00 0.00 L 219.76 0.00 L 219.76 31.00 L 0.00 31.00 Z M 0.00 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 460.00 184.87 L 640.00 184.87 L 640.00 215.87 L 460.00 215.87 Z M 460.00 184.87" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 228.82 0.00 L 640.00 0.00 L 640.00 31.00 L 228.82 31.00 Z M 228.82 0.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 0.00 185.00 L 448.54 185.00 L 448.54 215.87 L 0.00 215.87 Z M 0.00 185.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<text x="73.85" y="91.49" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >Player</text>
<text x="386.39" y="91.49" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >Browser</text>
<text x="495.99" y="276.43" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >Inspector</text>
<text x="175.80" y="276.36" font-family="Helvetica" font-size="24.00px" fill="currentColor" opacity="1.00" font-weight="bold" >Timeline</text>
<path d="M 0.00 144.13 L 219.76 144.13 L 219.76 175.13 L 0.00 175.13 Z M 0.00 144.13" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 460.00 329.00 L 640.00 329.00 L 640.00 360.00 L 460.00 360.00 Z M 460.00 329.00" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 228.82 144.13 L 640.00 144.13 L 640.00 175.13 L 228.82 175.13 Z M 228.82 144.13" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
<path d="M 0.00 329.13 L 448.54 329.13 L 448.54 360.00 L 0.00 360.00 Z M 0.00 329.13" stroke-width="2.50" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"  />
</svg>
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
[AssetObject](https://moviemasher.com/docs/interfaces/runtime_shared.AssetObject.html).
For instance, the following HTML loads a mash from a
JSON file:

```html
<movie-masher asset-object='mash.json'></movie-masher>
```

If it's not a mash asset object, a new one of the same type will 
be loaded instead, containing a clip referencing it. If a more complex 
[EndpointRequest](https://moviemasher.com/docs/interfaces/runtime_shared.EndpointRequest.html) 
is needed or you've already got an asset object to load, you can put it in the 
`assetObject` property of the 
[MovieMasher](https://moviemasher.com/docs/variables/runtime_client.MovieMasher.html) 
`options` object before loading the client library: 

```html
<script type='module'>
  import { MovieMasher } from '@moviemasher/runtime-client';
  MovieMasher.options.assetObject = { 
    type: 'video', source: 'mash',
    id: 'unique-id', color: '#FFFF00',
  };
  import '@moviemasher/lib-client/movie-masher.js';
</script>
```

### Populating the Media Browser
By default, an empty array of assets is supplied to the browser for display, 
which is appeneded to when importing additional media. This behavior can be
easily overriden by supplying a URL value for the MOVIE-MASHER element's 
`asset-objects` attribute. The JSON returned by the URL can be a valid array of 
[AssetObjects](https://moviemasher.com/docs/types/runtime_shared.AssetObjects.html). 
For instance, the following HTML loads static assets from a
JSON file:

```html
<movie-masher asset-objects='assets.json'></movie-masher>
```


Alternatively, a more complex request can be made by adding a 
[RequestObject](https://moviemasher.com/docs/interfaces/runtime_shared.RequestObject.html) to the
[MovieMasher](https://moviemasher.com/docs/variables/runtime_client.MovieMasher.html) global object's 
`options` before loading the client library: 

```html
<script type='module'>
  import { MovieMasher } from '@moviemasher/runtime-client';
  MovieMasher.options.assetObject = { 
    request: { endpoint: 'mash.json' } 
  };
  import '@moviemasher/lib-client/movie-masher.js';
</script>
```

### Saving Assets
### Uploading Media
### Encoding Mash
### Decoding Assets
### Transcoding Assets





<!-- MAGIC:START (FILE:src=../../../dev/documentation/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../../dev/documentation/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
more [extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->


<!-- MAGIC:START (FILE:src=../../../dev/documentation/snippet/foot.md) -->
<!-- The below content is automatically added from ../../../dev/documentation/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect34@moviemasher.com) to discuss ways to work on the project.
<!-- MAGIC:END -->

