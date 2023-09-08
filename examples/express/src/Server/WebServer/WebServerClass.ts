import type { HostServers } from '../../Host/Host.js'
import type { WebServer, WebServerArgs } from './WebServer.js'

import { ERROR, errorThrow } from '@moviemasher/runtime-shared'
import Express from 'express'
import fs from 'fs'
import path from 'path'
import { ServerClass } from '../ServerClass.js'

export class WebServerClass extends ServerClass implements WebServer {
  constructor(public args: WebServerArgs) { super(args) }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      Object.entries(this.args.sources).forEach(([url, fileOrDir]) => {
        const resolvedFileOrDir = path.resolve(fileOrDir)
        const exists = fs.existsSync(resolvedFileOrDir)
        const directory = exists && fs.lstatSync(resolvedFileOrDir).isDirectory()
        if (!exists) return errorThrow(ERROR.Url) 

        const index = directory ? 'index.html' : path.basename(resolvedFileOrDir)
        const indexDir = directory ? resolvedFileOrDir : path.dirname(resolvedFileOrDir)
        app.use(url, Express.static(indexDir, { index }))
        console.debug(this.constructor.name, 'startServer', url, 'from', indexDir)
      })
    })
  }
}
