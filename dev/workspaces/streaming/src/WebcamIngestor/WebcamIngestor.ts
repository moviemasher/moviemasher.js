import express from 'express'
import { Command, CommandOutputOptions } from '../Command/Command'

import { Server } from "../declaration"
import { WebcamConnection } from './WebcamConnection'

interface WebcamIngestorArgs {
  outputOptions?: CommandOutputOptions
  endpointPrefix?: string
  outputPrefix?: string
}

class WebcamIngestor implements Server {
  constructor(args?: WebcamIngestorArgs) {
    if (args) {
      if (args.endpointPrefix) this.endpointPrefix = args.endpointPrefix
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
      if (args.outputOptions) this.outputOptions = args.outputOptions
    }
  }

  endpointPrefix = '/webrtc'

  outputOptions = Command.outputHls()

  outputPrefix = './temp/webrtc'

  start(app:express.Application):void {
    app.get(this.endpointPrefix, (_req, res) => {
      console.log(`GET ${this.endpointPrefix}`)
      res.send(WebcamConnection.getConnections())
    })

    app.post(this.endpointPrefix, async (_req, res) => {
      console.log(`POST ${this.endpointPrefix}`)
      try {
        const connection = await WebcamConnection.createConnection(this.outputPrefix, this.outputOptions)
        res.send(connection)
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.delete(`${this.endpointPrefix}/:id`, (req, res) => {
      const { id } = req.params
      const connection = WebcamConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`DELETE ${this.endpointPrefix} ${id}`)
      connection.close()
      res.send(connection)
    })

    app.get(`${this.endpointPrefix}/:id`, (req, res) => {
      const { id } = req.params
      const connection = WebcamConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.endpointPrefix} ${id}`)
      res.send(connection)
    })

    app.get(`${this.endpointPrefix}/:id/local-description`, (req, res) => {
      const { id } = req.params
      const connection = WebcamConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.endpointPrefix} local-description ${id}`)
      res.send(connection.toJSON().localDescription)
    })

    app.get(`${this.endpointPrefix}/:id/remote-description`, (req, res) => {
      const { id } = req.params
      const connection = WebcamConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`GET ${this.endpointPrefix} remote-description ${id}`)
      res.send(connection.toJSON().remoteDescription)
    })

    app.post(`${this.endpointPrefix}/:id/remote-description`, async (req, res) => {
      const { id } = req.params
      const connection = WebcamConnection.getConnection(id)
      if (!connection) {
        res.sendStatus(404)
        return
      }
      console.log(`POST ${this.endpointPrefix} remote-description ${id}`)
      try {
        await connection.applyAnswer(req.body)
        res.send(connection.toJSON().remoteDescription)
      } catch (error) {
        console.error(error)
        res.sendStatus(400)
      }
    })
  }

  stop(): void { WebcamConnection.close() }
}

export { WebcamIngestor }
