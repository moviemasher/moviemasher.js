## Client Example

The HTML document below can be hosted on a web server to deliver the Movie Masher application. 
The first SCRIPT element is an 
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
which tells the browser where to import the Movie Masher and Lit modules. 
The second SCRIPT element imports the MOVIE-MASHER custom element, which is then used in the BODY.
<details open>

<summary>example.html</summary>
<hr/>

<!-- MAGIC:START (TRIMCODE:src=html/examples/simple.html) -->

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
<!-- MAGIC:END -->

</details>

Without additional styling the `MovieMasherElement` element will fill its container both horizontally and vertically, with some padding. In this example we use the STYLE element to define the BODY as an unpadded flex box so it fills the whole viewport. We also use a media query to set a page background color when the user's device is in dark mode (the editor adjusts automatically). 
