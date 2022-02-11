import Express from 'express'
import cors from 'cors'

import { ApiServer, ApiServerArgs } from "../Server/ApiServer/ApiServer"
import { DataServer, DataServerArgs } from "../Server/DataServer/DataServer"
import { FileServer, FileServerArgs } from "../Server/FileServer/FileServer"
import { RenderingServer, RenderingServerArgs } from "../Server/RenderingServer/RenderingServer"
import { StreamingServer, StreamingServerArgs } from "../Server/StreamingServer/StreamingServer"
import { WebServer, WebServerArgs } from "../Server/WebServer/WebServer"
import { Server } from '../Server/Server'
import { ServerType, StringObject } from '@moviemasher/moviemasher.js'

interface HostOptions {
  api?: ApiServerArgs | false
  corsOptions?: StringObject | false
  data?: DataServerArgs | false
  file?: FileServerArgs | false
  port: number
  rendering?: RenderingServerArgs | false
  streaming?: StreamingServerArgs | false
  web?: WebServerArgs | false
}

interface HostServers {
  [ServerType.Api]?: ApiServer
  [ServerType.Data]?: DataServer
  [ServerType.File]?: FileServer
  [ServerType.Rendering]?: RenderingServer
  [ServerType.Streaming]?: StreamingServer
  [ServerType.Web]?: WebServer
}

class Host {
  constructor(object: HostOptions) { this.args = object }

  args: HostOptions

  start() {
    const { corsOptions, port, api, file, data, rendering, streaming, web } = this.args
    const HostServers: HostServers = {}
    if (api) HostServers[ServerType.Api] = new ApiServer(api)
    if (data) HostServers[ServerType.Data] = new DataServer(data)
    if (file) HostServers[ServerType.File] = new FileServer(file)
    if (rendering) HostServers[ServerType.Rendering] = new RenderingServer(rendering)
    if (streaming) HostServers[ServerType.Streaming] = new StreamingServer(streaming)
    if (web) HostServers[ServerType.Web] = new WebServer(web)

    const servers: Server[] = Object.values(HostServers)
    if (!servers.length) {
      console.log(this.constructor.name, "nothing configured")
      return
    }

    const app = Express()
    app.use(Express.json())
    if (corsOptions) app.use(cors(corsOptions))
    servers.forEach(server => { server.startServer(app, HostServers) })
    const server = app.listen(port, () => { console.log(`Listening on port ${port}`) })
    server.once('close', () => { servers.forEach(server => server.stopServer()) })
  }
}

export { Host, HostOptions, HostServers }
