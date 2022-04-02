## Server Example

<fieldset>

<legend>server.ts</legend>

<!-- MAGIC:START (TRIMCODE:src=../../../../workspaces/example-express-react/src/server.ts) -->

```ts
import fs from 'fs'
import path from 'path'
import { Host, DefaultHostOptions } from '@moviemasher/server-express'

const resolved = path.resolve(__dirname, './server-config.json')
const json = fs.readFileSync(resolved).toString()
const options = JSON.parse(json)
const host = new Host(DefaultHostOptions(options))
host.start()
```
<!-- MAGIC:END -->
</fieldset>

In this example we're using the
[DefaultHostOptions](https://moviemasher.com/docs/function/DefaultHostOptions.html) function to
create the [Host](https://moviemasher.com/docs/component/Host.html) constructor arguments from a JSON file with the following structure:

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

We are setting the preview dimensions to their default for demonstration purposes. The server will pass these to the client and the client will apply them, but only after the CSS is applied so a resize will be visible if they differ. Preview dimensions should be overridden either in the client, or better still, in the CSS. If the defaults are overidden there they should be here too, since the client does NOT pass them to the server. The rendering server uses them to optimally size previews of uploaded video and images.

We are also setting the output dimensions here, which are used as default values for both the rendering and streaming servers. Please note: they should always be an even multiple of the preview dimensions - in this case it's a multiple of four. Using different aspect ratios is actually supported, but then the preview in the client will not match the output of these servers.

Learn more about building your own customized server in the
[Integration Guide](https://moviemasher.com/docs/Integration.html).
