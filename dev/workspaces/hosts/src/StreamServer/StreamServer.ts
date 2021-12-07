import express from "express"
import { v4 as uuid } from 'uuid'
import { UnknownObject } from "@moviemasher/moviemasher.js"

import { Command } from "../Command/Command"


import { Server, StreamServerArgs } from "../declaration"
import { StreamConnection } from "./StreamConnection"

class StreamServer implements Server {
  constructor(args?: StreamServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
      if (args.outputOptions) this.outputOptions = args.outputOptions
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
    }
  }

  index(): UnknownObject { return {} }

  outputOptions = Command.outputHls()

  outputPrefix = './temporary/streams'

  prefix = '/stream'

 start(app:express.Application):void {
    app.get(`${this.prefix}(/:format)?`, (req, res) => {
      const { format } = req.params

      // const { fps, size } = this.outputOptions
      // const dimensions = size || Default.mash.output.size
      // const [width, height] = dimensions.split('x').map(Number)
      const response = this.outputOptions //{ id, fps, width, height }
      console.log(`GET ${this.prefix}`, response, format)
      res.send(response)
    })

   app.post(this.prefix, (req, res) => {
      const { body } = req
      const id = uuid()

      // TODO check for error
      StreamConnection.create(id, this.outputPrefix, body)
      const response = { id }
      console.log(`GET ${this.prefix}`, response)
      res.send(response)
    })

    app.post(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params
      const connection = StreamConnection.get(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      try {
        console.log(`POST ${this.prefix}/${id}`, req.body)
        const response = connection.update(req.body)

        console.log(`POST ${this.prefix}/${id}`, response)
        res.send(response)

      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.delete(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params
      console.log(`DELETE ${this.prefix} ${id}`)
      res.send({id})
    })

    app.get(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params

      console.log(`GET ${this.prefix} ${id}`)
      res.send({id})
    })
  }

  stop(): void {}
}

export { StreamServer, StreamServerArgs }
