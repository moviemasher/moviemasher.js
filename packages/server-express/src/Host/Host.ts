import Express from 'express'
import cors from 'cors'
import { ServerType, StringObject } from '@moviemasher/moviemasher.js'

import { ApiServerClass } from "../Server/ApiServer/ApiServerClass"
import { ApiServer, ApiServerArgs } from "../Server/ApiServer/ApiServer"
import { DataServerClass } from "../Server/DataServer/DataServerClass"
import { FileServerClass } from "../Server/FileServer/FileServerClass"
import { RenderingServerClass } from "../Server/RenderingServer/RenderingServerClass"
import { StreamingServerClass } from "../Server/StreamingServer/StreamingServerClass"
import { WebServer, WebServerArgs } from "../Server/WebServer/WebServer"
import { Server } from '../Server/Server'
import { DataServer, DataServerArgs } from '../Server/DataServer/DataServer'
import { FileServer, FileServerArgs } from '../Server/FileServer/FileServer'
import { StreamingServer, StreamingServerArgs } from '../Server/StreamingServer/StreamingServer'
import { RenderingServer, RenderingServerArgs } from '../Server/RenderingServer/RenderingServer'
import { WebServerClass } from '../Server/WebServer'

export interface HostOptions {
  api?: ApiServerArgs | false
  corsOptions?: StringObject | false
  data?: DataServerArgs | false
  file?: FileServerArgs | false
  port: number
  host: string
  rendering?: RenderingServerArgs | false
  streaming?: StreamingServerArgs | false
  web?: WebServerArgs | false
  version?: string
}

export interface HostServers {
  [ServerType.Api]?: ApiServer
  [ServerType.Data]?: DataServer
  [ServerType.File]?: FileServer
  [ServerType.Rendering]?: RenderingServer
  [ServerType.Streaming]?: StreamingServer
  [ServerType.Web]?: WebServer
}

export class Host {
  constructor(object: HostOptions) { this.args = object }

  args: HostOptions

  start() {
    const { corsOptions, host, port, api, file, data, rendering, streaming, web } = this.args
    const HostServers: HostServers = {}
    if (api) HostServers[ServerType.Api] = new ApiServerClass(api)
    if (data) HostServers[ServerType.Data] = new DataServerClass(data)
    if (file) HostServers[ServerType.File] = new FileServerClass(file)
    if (rendering) HostServers[ServerType.Rendering] = new RenderingServerClass(rendering)
    if (streaming) HostServers[ServerType.Streaming] = new StreamingServerClass(streaming)
    if (web) HostServers[ServerType.Web] = new WebServerClass(web)

    const servers: Server[] = Object.values(HostServers)
    if (!servers.length) {
      console.log(this.constructor.name, "nothing configured")
      return
    }

    const app = Express()
    app.use(Express.json())
    if (corsOptions) app.use(cors(corsOptions))
    servers.forEach(server => { server.startServer(app, HostServers) })
    const server = app.listen(port, host, () => { console.log(`Listening on port ${port}`) })
    server.once('close', () => { servers.forEach(server => server.stopServer()) })
  }
}
