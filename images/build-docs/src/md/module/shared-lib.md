## shared-lib

The 
[@moviemasher/shared-lib](https://www.npmjs.com/package/@moviemasher/shared-lib)
module is imported by high-level libraries like 
[@moviemasher/client-lib](https://www.npmjs.com/package/@moviemasher/client-lib) 
and
[@moviemasher/server-lib](https://www.npmjs.com/package/@moviemasher/server-lib),
and not typically installed directly. 
It exports classes and functions needed both on the server and in the client.

This module is built from code and configuration available in the
[Movie Masher Github Repository](https://github.com/moviemasher/moviemasher.js).
The NPM distribution includes TypeScript source code files, as well as minified 
JavaScript files intended to be imported 
directly by other modules. Each source file is distributed individually as a
separate JavaScript file. The JavaScript includes source maps to the 
TypeScript for easier debugging. 
