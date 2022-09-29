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
    <!-- In production: change extension from '.js' to '.min.js' -->
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

_Please note_ that this example will only display what's on the first frame of our mash and will not update if we subsequently use the editor to make changes. Its utility is limited to displaying a mash at a particular time. 

Learn more about how the codebase is structured in the
[Architecture Guide](https://moviemasher.com/docs/Architecture.html).