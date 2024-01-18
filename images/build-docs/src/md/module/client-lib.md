## client-lib

The 
[@moviemasher/client-lib](https://www.npmjs.com/package/@moviemasher/client-lib)
module can be imported directly into your HTML or JavaScript to add video 
editing functionality. It exports types, interfaces, classes, functions, and 
[web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) 
that support responding to client events. It imports the 
[@moviemasher/shared-lib](https://www.npmjs.com/package/@moviemasher/shared-lib)
module, as well as several [Lit](https://lit.dev/) modules to support custom 
interface elements like the player, browser, timeline, and inspector. 

This module is built from code and configuration available in the
[Movie Masher Github Repository](https://github.com/moviemasher/moviemasher.js).
The NPM distribution includes TypeScript source code files, as well as minified 
JavaScript files intended to be imported 
directly in the web browser. Each source file is distributed individually as a
separate JavaScript file. The JavaScript includes source maps to the 
TypeScript for easier debugging. Some JSON data files are also included containing 
default icons and assets. 
