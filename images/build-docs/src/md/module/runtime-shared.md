## runtime-shared

The 
[@moviemasher/runtime-shared](https://www.npmjs.com/package/@moviemasher/runtime-shared)
module is imported by high-level libraries like 
[@moviemasher/lib-client](https://www.npmjs.com/package/@moviemasher/lib-client) 
and
[@moviemasher/lib-server](https://www.npmjs.com/package/@moviemasher/lib-server), 
and not typically installed directly. It exports core 
types, interfaces, and utility functions needed at runtime by all other modules.

This module is built from code and configuration available in the
[Movie Masher Github Repository](https://github.com/moviemasher/moviemasher.js).
The NPM distribution includes TypeScript source code files, as well as a  
minified JavaScript file intended to be imported directly from other modules. 
All source files are distributed as a single JavaScript file. The JavaScript 
includes source maps to the TypeScript for easier debugging. 
