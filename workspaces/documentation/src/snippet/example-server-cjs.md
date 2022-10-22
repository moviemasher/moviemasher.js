## CJS Server Example
The source code is available in CommonJS format for direct use in NodeJS, or as TypScript for rebundling with tools like [rollup.js](https://rollupjs.org/).

### Installation 

The following shell command installs the server and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```
Alternatively, if you're wanting to build your own server you can just install and build off the [core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js) instead.

### _Please note_ 
This does not install a client implementation that interacts with this package. Learn more about how the codebase is structured in the
[Architecture Overview](https://moviemasher.com/docs/Architecture.html).

### Inclusion 

<fieldset>

<legend>server.ts</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/src/server.ts) -->

```ts
import path from 'path'
import { Host, HostDefaultOptions, expandToJson } from '@moviemasher/server-express'

const config = process.argv[2] || path.resolve(__dirname, './server-config.json')
const configuration = expandToJson(config)
const options = HostDefaultOptions(configuration)
const host = new Host(options)
host.start()
```
<!-- MAGIC:END -->
</fieldset>

In this example we're using the [[Host]] class to construct all the [[Server]] instances, using arguments provided by the [[HostDefaultOptions]] function. We pass this function a parsed JSON file with the following structure:

<fieldset>

<legend>server-config.json</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/src/server-config.json) -->

```json
{
  "port": 8570,
  "previewSize": { "width": 480, "height": 270 },
  "outputSize": { "width": 1920, "height": 1080 }
}
```
<!-- MAGIC:END -->
</fieldset>

In the configuration we are setting the preview dimensions to their default for demonstration purposes. The server will pass these to the client and the client will apply them, but only after the CSS is applied so a resize will be visible if they differ. Preview dimensions should be overridden either in the client, or better still, in the CSS. If the defaults are overidden there they should be here too, since the client does NOT pass them to the server. The rendering server uses them to optimally size previews of uploaded video and images.

We are also setting the output dimensions here, which are used as default values for both the rendering and streaming servers. They should always be an even multiple of the preview dimensions - in this case it's a multiple of four. Using different aspect ratios is actually supported, but then the preview in the client will not match the output of these servers.
