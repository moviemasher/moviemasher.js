import type { Application } from 'express'
import type { WebServerArgs } from '../types.js'
import type { ServeStaticOptions } from 'serve-static'

import Express from 'express'
import fs from 'fs'
import path from 'path'
import { ServerClass } from './ServerClass.js'

export class WebServerClass extends ServerClass {
  constructor(public args: WebServerArgs) { super(args) }

  startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      Object.entries(this.args.sources).forEach(([url, fileOrDir]) => {
        const ext = path.extname(fileOrDir)
        const isDirectory = !ext
        const resolvedFileOrDir = path.resolve(fileOrDir)
        const indexDir = isDirectory ? resolvedFileOrDir : path.dirname(resolvedFileOrDir)
        const exists = fs.existsSync(indexDir)
        if (!exists) {
          // console.log(this.constructor.name, 'startServer creating', indexDir)
          fs.mkdirSync(indexDir, { recursive: true })
        }

        const index = isDirectory ? 'index.html' : path.basename(resolvedFileOrDir)
        const options: ServeStaticOptions = { index }

        app.use(url, Express.static(indexDir, options))
        // console.debug(this.constructor.name, 'startServer', url, 'from', indexDir, { isDirectory, ext, resolvedFileOrDir, fileOrDir })
      })
    })
  }
}
