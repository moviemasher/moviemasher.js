## Server Example

The following shell command installs the server and required packages to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```

The script below can then be included in your project and triggered in a variety of ways. The most straightfoward is to simply pass its path directly to node.

<fieldset>

<legend>server.js</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express/host/server.js) -->

```js
const MovieMasherServer = require("@moviemasher/server-express")

const { Host } = MovieMasherServer
const options = { 
  port: 8572, host: '0.0.0.0', 
  api: { authentication: { type: 'basic' } } 
}
const host = new Host(options)
host.start()
```
<!-- MAGIC:END -->
</fieldset>

The script first requires MovieMasherServer, then destructures what's needed from it. In this example we're just grabbing the `Host` class and corresponding `HostDefaultOptions` function. We call the later with the desired port number, and then pass the options it returns as arguments to the class constructor. Finally, the `start` method of the new instance is called to start the ExpressJS server. 

While the server is running, requests can be made to http://localhost:8570 following half a dozen APIs that save data, handle uploads, render video, etc. 

### _Please note_
This example installs an FFmpeg build that has limited rendering capabilities due to lack of support of SVG files. Typically a custom build is utilized instead. Learn more about integrating your own services in the [Server Developer Guide](https://moviemasher.com/docs/ServerDeveloper.html).