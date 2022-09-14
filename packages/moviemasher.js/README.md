<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/head.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/head.md -->
[![Image](https://moviemasher.com/media/img/moviemasher.svg "Movie Masher")](https://moviemasher.com)

| JavaScript video editor, encoder, switcher | _NEW in version 5.1.0_ |
| -- | -- |
| **visual compositing** through _SVG API_ <br> **audio mixing** through _WebAudio API_ <br> **client** implemented in _ReactJS_ <br> **server** implemented in _ExpressJS_  <br> **encode** and **stream** through _FFmpeg_ | • container/content pattern <br> • vector-based masking <br> • tranform/color tweening <br> • WYSIWYG player editing <br> • reorganized inspector |
<!-- MAGIC:END -->

## Core Library

This module is a peer dependency of both
[@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) and
[@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express) modules, and not typically installed directly. It exports core interfaces, classes, factories, utility methods, enumerations, and types related to creating, managing and rendering video edit decision lists.

<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/documentation.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/documentation.md -->
## Documentation

In addition to this README, there is a simple
[demo](https://moviemasher.com/docs/demo/index.html) and
[more extensive documentation](https://moviemasher.com/docs/index.html) available on
[MovieMasher.com](https://moviemasher.com/). Inline documentation and code completion is
also available when using a code editor that supports TypeScript and IntelliSense.
<!-- MAGIC:END -->

<!-- MAGIC:START (FILEMD:src=../../dev/docs/md/snippet/example-core.md&stripMagic=true) -->
## Core Example

The HTML document below can simply be loaded in a web browser to display the simplest 'hello world' example. The SCRIPT tag within the HEAD tag loads the latest version of the core library directly from NPM through a CDN. The BODY contains just an empty SVG tag followed by another SCRIPT tag containing code that uses the library to populate it with SVGElements. 

<fieldset>
<legend>moviemasher.html</legend>

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Movie Masher</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src="https://unpkg.com/@moviemasher/moviemasher.js/dist/moviemasher.js" crossorigin></script>
  </head>
  <body>
    <svg id="svg" width="640" height="480"></svg>
    <script>

const svg = document.getElementById('svg')
const { editorInstance, ContainerTextId } = MovieMasher
const editor = editorInstance({ rect: svg.getBoundingClientRect() })
const clip = { 
  container: { string: 'Hello World!' }, containerId: ContainerTextId
}
editor.load({ mash: { tracks: [{ clips: [clip] }] } }).then(() => {
  editor.svgItems().then(svgs => svg.append(...svgs))
})
 
    </script>
  </body>
</html>
```
</fieldset>

The SCRIPT first stores the SVG element in the `svg` variable and then destructures what's needed from the core library. The `editorInstance` method is used to construct an editor, which is a specialized object capable of loading and previewing an 'edit decision list'. The SVG's bounding rect is provided to the editor so it knows how big a preview to generate. 

This example includes just a single text clip on a single track, but multiple tracks containing multiple clips of different types could be provided. In Movie Masher, text is a kind of container so we specify `ContainerTextId` as the clip's `containerId` and populate `container` with the `string` we want to display. 

This clip is then nested within a mash object which is passed to the editor's `load` method. This returns a promise that resolves once the first frame can be displayed, in this case waiting until the default font is loaded. 

The editor's `svgItems` method is then called which returns another promise that resolves with an array of elements. These are simply then appended to our SVG tag. 

_Please note_ that this example will only display what's on the first frame of our mash and will not update if we subsequently use the editor to make changes. Its utility is limited to displaying a mash at a particular time. 



Learn more about building a fully customized video editing client in the
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html).

<!-- MAGIC:END -->
<!-- MAGIC:START (FILE:src=../../dev/docs/md/snippet/foot.md) -->
<!-- The below content is automatically added from ../../dev/docs/md/snippet/foot.md -->
## Feedback

If any problems arise while utilizing the Movie Masher repository, a
[GitHub Issue Ticket](https://github.com/moviemasher/moviemasher.js/issues) should be filed.
Further support is occassionally offered to particular projects on an hourly consulting basis.

Pull requests for fixes, features, and refactorings
are always appreciated, as are documentation updates. Creative help with graphics, video
and the web site is also needed. Please [send an email](mailto:connect27@moviemasher.com)
to discuss ways to contribute to the project.
<!-- MAGIC:END -->
