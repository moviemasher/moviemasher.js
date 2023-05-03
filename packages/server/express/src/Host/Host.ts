import Express from 'express'
import cors from 'cors'
import { StringRecord } from '@moviemasher/lib-core'

import { DataServerClass } from "../Server/DataServer/DataServerClass"
import { FileServerClass } from "../Server/FileServer/FileServerClass"
import { RenderingServerClass } from "../Server/RenderingServer/RenderingServerClass"
import { WebServer, WebServerArgs } from "../Server/WebServer/WebServer"
import { Server } from '../Server/Server'
import { DataServer, DataServerArgs } from '../Server/DataServer/DataServer'
import { FileServer, FileServerArgs } from '../Server/FileServer/FileServer'
import { RenderingServer, RenderingServerArgs } from '../Server/RenderingServer/RenderingServer'
import { WebServerClass } from '../Server/WebServer'

export interface HostOptions {
  corsOptions?: StringRecord | false
  data?: DataServerArgs | false
  file?: FileServerArgs | false
  port: number
  host: string
  rendering?: RenderingServerArgs | false
  web?: WebServerArgs | false
  version?: string
}

export interface HostServers {
  data?: DataServer
  file?: FileServer
  rendering?: RenderingServer
  web?: WebServer
}

export class Host {
  constructor(object: HostOptions) { this.args = object }

  args: HostOptions

  start() {
    const { corsOptions, host, port, file, data, rendering, web } = this.args
    const HostServers: HostServers = {}
    if (data) HostServers.data = new DataServerClass(data)
    if (file) HostServers.file = new FileServerClass(file)
    if (rendering) HostServers.rendering = new RenderingServerClass(rendering)
    if (web) HostServers.web = new WebServerClass(web)

    const servers: Server[] = Object.values(HostServers)
    if (!servers.length) {
      console.warn(this.constructor.name, "nothing configured")
      return
    }

    const app = Express()
    app.use(Express.json())
    if (corsOptions) app.use(cors(corsOptions))
    const promises = servers.map(server => server.startServer(app, HostServers))
    return Promise.all(promises).then(() => {
      const server = app.listen(port, host, () => { console.log(`Listening on port ${port}`) })
      server.once('close', () => { servers.forEach(server => server.stopServer()) })
    })

  }
}
