import express from "express"
import fs from 'fs'
import path from 'path'
import { JsonObject, UnknownObject } from "@moviemasher/moviemasher.js"

import { StorageServerArgs, Server } from "../declaration"


class StorageServer implements Server {
  constructor(args?: StorageServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
      if (args.uploadsPrefix) this.uploadsPrefix = args.uploadsPrefix
    }
  }

  id = 'storage'

  init(): JsonObject { return {} }

  prefix = '/storage'

  start(app: express.Application): void {
    fs.mkdirSync(path.dirname(this.uploadsPrefix), { recursive: true })
    console.log("StorageServer.start", this.prefix)

    app.put(`${this.prefix}/upload/:user/:name`, async (req, res) => {
      try {
        const { user, name } = req.params
        const file = req.body

        fs.promises.writeFile(`${this.uploadsPrefix}/${user}/${name}`, file).then(() => {
          const response = {}
          res.send(response)
        })

      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

  }

  stop(): void {}

  uploadsPrefix = "./temporary/uploads"

}

export { StorageServer, StorageServerArgs }
