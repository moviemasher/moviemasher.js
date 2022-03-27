import Express from 'express'
import path from 'path'
import fs from 'fs'
import { StringObject } from "@moviemasher/moviemasher.js"

import { ServerClass } from "../ServerClass"
import { ServerArgs } from '../Server'
import { HostServers } from '../../Host/Host'


interface WebServerArgs extends ServerArgs {
  sources: StringObject
}

class WebServer extends ServerClass {
  declare args: WebServerArgs
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
      console.log(this.constructor.name, "serving", url, "from", indexDir, "with", index, "index")
    })
  }
}

export { WebServer, WebServerArgs }