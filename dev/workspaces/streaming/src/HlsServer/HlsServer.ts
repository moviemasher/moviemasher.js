import express from 'express'
import fs from 'fs'
import path from 'path'

import { Server } from "../declaration"

interface HlsServerArgs {
  endpointPrefix?: string
  inputPrefix?: string
}

class HlsServer implements Server {
  constructor(args?: HlsServerArgs) {
    if (args) {
      if (args.endpointPrefix) this.endpointPrefix = args.endpointPrefix
      if (args.inputPrefix) this.inputPrefix = args.inputPrefix
    }
  }

  endpointPrefix = 'hls'

  inputPrefix = './temp/hls'

  start(app:express.Application):void {
    app.get(`/${this.endpointPrefix}/:id/*.ts`, async (req, res) => {
      const { params, path: requestPath } = req
      const fileName = path.basename(requestPath)
      const { id } = params
      const file = `${this.inputPrefix}/${id}/${fileName}`
      console.log("file", file)
      try { res.send(fs.readFileSync(file)) }
      catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    })

    app.get(`/${this.endpointPrefix}/:id/*.m3u8`, async (req, res) => {
      console.log(`${this.endpointPrefix}/:id/*.m3u8`)
      const { id } = req.params
      try {
        const streamDir = `${this.inputPrefix}/${id}`
        const ext = 'm3u8'
        const files = fs.readdirSync(streamDir)
        const playlistFiles = files.filter(file => file.endsWith(ext)).sort()

        const last = playlistFiles[playlistFiles.length - 1]
        res.send(fs.readFileSync(`${streamDir}/${last}`))

      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    })
  }

  stop():void {}
}

export { HlsServer }

// http://localhost:8577/hls/5d67cf47-a206-4693-998e-6979dd6e7fd8/stream.m3u8
