import express from 'express'
const uuid = require('uuid').v4
// import { v4 as uuid } from 'uuid'

import { Server, WebrtcServerArgs } from "../declaration"
import { WebrtcConnection } from './WebrtcConnection'
import { JsonObject, outputHls } from '@moviemasher/moviemasher.js'

class WebrtcServer implements Server {
  constructor(args?: WebrtcServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
      if (args.outputOptions) this.outputOptions = args.outputOptions
    }
  }

  id = 'webrtc'

  init(): JsonObject { return {} }

  prefix = '/webrtc'

  outputOptions = outputHls()

  outputPrefix = './temporary/streams/webrtc'

  start(app:express.Application):void {

    app.get(this.prefix, async (_req, res) => {
      console.log(`POST ${this.prefix}`)
      try {
        const id = uuid()
        const connection = await WebrtcConnection.create(id, this.outputPrefix, this.outputOptions)
        res.send(connection)
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.delete(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`DELETE ${this.prefix} ${id}`)
      connection.close()
      res.send(connection)
    })

    app.get(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.prefix} ${id}`)
      res.send(connection)
    })

    app.get(`${this.prefix}/:id/local-description`, (req, res) => {
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.prefix} local-description ${id}`)
      res.send(connection.toJSON().localDescription)
    })

    app.get(`${this.prefix}/:id/remote-description`, (req, res) => {
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.prefix} remote-description ${id}`)
      res.send(connection.toJSON().remoteDescription)
    })

    app.post(`${this.prefix}/:id/remote-description`, async (req, res) => {
      const { id } = req.params
      const connection = WebrtcConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`POST ${this.prefix} remote-description ${id}`)
      try {
        await connection.applyAnswer(req.body)
        res.send(connection.toJSON().remoteDescription)
      } catch (error) {
        console.error(error)
        res.sendStatus(400)
      }
    })
  }

  stop(): void { WebrtcConnection.close() }
}

export { WebrtcServer, WebrtcServerArgs }
