## Core Example

The HTML document below can be loaded in a web browser to display the simplest 'hello world' example. The SCRIPT tag within the HEAD tag loads the UMD version of the core library directly from NPM through a CDN. The BODY contains just an empty SVG tag followed by another SCRIPT tag containing code that uses the library to populate it with SVGElements. 

<fieldset>
<legend>moviemasher.html</legend>
<!-- MAGIC:START (TRIMCODE:src=../../../../packages/moviemasher.js/dev/example/index.html) -->

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src="https://unpkg.com/@moviemasher/moviemasher.js/@5.1.0/umd/moviemasher.js" crossorigin></script>
  </head>
  <body>
    <svg id="svg" width="640" height="480"></svg>
    <script>
const element = document.getElementById('svg')
const { editorInstance, TextContainerId } = MovieMasher
const editor = editorInstance({ rect: element.getBoundingClientRect() })
const clip = { 
  container: { string: 'Hello World!' }, containerId: TextContainerId
}
editor.load({ mash: { tracks: [{ clips: [clip] }] } }).then(() => {
  editor.svgItems().then(svgs => element.append(...svgs))
})
    </script>
  </body>
</html>
```
<!-- MAGIC:END -->
</fieldset>

The SCRIPT code first stores the SVG element in the `element` variable and then destructures what's needed from the core library. The `editorInstance` method is used to construct an editor, which is a specialized object capable of loading and previewing content. The SVG's bounding rect is provided to the editor so it knows how big a preview to generate. 

This example includes just a single text clip on a single track, but multiple tracks containing multiple clips of different types could be provided. In Movie Masher, text is a kind of container so we specify `TextContainerId` as the clip's `containerId` and populate `container` with the `string` we want to display. 

This clip is then nested within a mash object which is passed to the editor's `load` method. This returns a promise that resolves once the first frame can be displayed, in this case waiting until the default font is loaded. The editor's `svgItems` method is then called which returns another promise that resolves with an array of elements. These are simply then appended to our SVG tag. 

| <svg width="1rem" height="1rem" viewBox="0 0 512 512"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" stroke="none" fill="currentColor" /></svg> | _Please note_ |
| -- | -- |
|  | This example will only display what's on the first frame of our mash and will not update if we subsequently use the editor to make changes. More typically the client package is used, even when just displaying a mash. Learn more about how the codebase is structured in the [Architecture Overview](https://moviemasher.com/docs/Architecture.html). |

