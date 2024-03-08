import type { HostOptions, Server } from '../types.js'

import cors from 'cors'
import Express from 'express'
import { DataServerClass } from '../Server/DataServerClass.js'
import { DecodeServerClass } from '../Server/DecodeServerClass.js'
import { EncodeServerClass } from '../Server/EncodeServerClass.js'
import { TranscodeServerClass } from '../Server/TranscodeServerClass.js'
import { UploadServerClass } from '../Server/UploadServerClass.js'
import { WebServerClass } from '../Server/WebServerClass.js'

export class Host {
  constructor(public args: HostOptions) { }

  start() {
    const { corsOptions, host, port, upload, data, encode, web, decode, transcode } = this.args
    const servers: Server[] = []
    if (data) servers.push(new DataServerClass(data))
    if (upload) servers.push(new UploadServerClass(upload))
    if (encode) servers.push(new EncodeServerClass(encode))
    if (transcode) servers.push(new TranscodeServerClass(transcode))

    if (decode) servers.push(new DecodeServerClass(decode))
    if (web) servers.push(new WebServerClass(web))
    if (!servers.length) {
      console.warn(this.constructor.name, 'nothing configured')
      return
    }
    const app = Express()
    app.use(Express.json())
    if (corsOptions) app.use(cors(corsOptions))
    const promises = servers.map(server => server.startServer(app))
    return Promise.all(promises).then(() => {
      const server = app.listen(port, host, () => { console.log(`Listening on port ${port} ${host}`) })
      server.once('close', () => { servers.forEach(server => server.stopServer()) })
    })
  }
}
