import Express from 'express'
import path from 'path'
import fs from 'fs'

import { ServerClass } from "../ServerClass"
import { HostServers } from '../../Host/Host'
import { WebServer, WebServerArgs } from './WebServer'


export class WebServerClass extends ServerClass implements WebServer {
  constructor(public args: WebServerArgs) { super(args) }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)

    Object.entries(this.args.sources).forEach(([url, fileOrDir]) => {
      const resolved = path.resolve(fileOrDir)
      const exists = fs.existsSync(resolved)
      const directory = exists && fs.lstatSync(resolved).isDirectory()
      if (!exists) throw `${this.constructor.name}.startServer ${resolved}`

      const index = directory ? 'index.html' : path.basename(resolved)
      const indexDir = directory ? resolved : path.dirname(resolved)
      app.use(url, Express.static(indexDir, { index }))
      console.debug(this.constructor.name, "serving", url, "from", indexDir, "with", index, "index")
    })
  }
}
