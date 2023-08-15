import type { HostServers } from '../../Host/Host.js'
import type { WebServer, WebServerArgs } from './WebServer.js'

import Express from 'express'
import fs from 'fs'
import path from 'path'
import { ServerClass } from '../ServerClass.js'

export class WebServerClass extends ServerClass implements WebServer {
  constructor(public args: WebServerArgs) { super(args) }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      Object.entries(this.args.sources).forEach(([url, fileOrDir]) => {
        const resolved = path.resolve(fileOrDir)
        const exists = fs.existsSync(resolved)
        const directory = exists && fs.lstatSync(resolved).isDirectory()
        if (!exists) throw `${this.constructor.name}.startServer ${resolved}`

        const index = directory ? 'index.html' : path.basename(resolved)
        const indexDir = directory ? resolved : path.dirname(resolved)
        app.use(url, Express.static(indexDir, { index }))
        console.debug(this.constructor.name, 'serving', url, 'from', indexDir, 'with', index, 'index')
      })
    })
  }
}
