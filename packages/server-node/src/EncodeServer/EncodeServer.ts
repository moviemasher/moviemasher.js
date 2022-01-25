import express from "express"

const uuid = require('uuid').v4
//import { v4 as uuid } from 'uuid'
import {
  outputHls, outputMp4, EncodeStreamResponse,
  EncodeUpdateRequest, EncodeUpdateResponse,
  EditType, EncodeOptionsRequest, EncodeOptionsResponse, JsonObject, OutputObject,
} from "@moviemasher/moviemasher.js"

import { Server, EncodeServerArgs, EditOutputObject, ServerHandler } from "../declaration"
import { EncodeConnection } from "./EncodeConnection"

class EncodeServer implements Server {
  constructor(args?: EncodeServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
      if (args.output) this.output = args.output
      if (args.outputPrefix) this.outputPrefix = args.outputPrefix
    }
  }


  options: ServerHandler<EncodeOptionsResponse, EncodeOptionsRequest> = (req, res) => {
    const { body } = req
    const { type } = body
    const response: EncodeOptionsResponse = this.output[type]
    console.log(`EncodeOptionsResponse ${this.prefix}/options`, response)
    res.send(response)
  }

  id = 'encode'

  init(): JsonObject { return {} }

  output: EditOutputObject = {
    [EditType.Mash]: outputMp4(),
    [EditType.Stream]: outputHls()
  }

  outputPrefix = './temporary/streams'

  prefix = '/encode'

  start(app:express.Application):void {
    app.post(`${this.prefix}/options`, this.options)
    app.get(`${this.prefix}/stream`, this.stream)
    app.post(`${this.prefix}/update`, this.update)
  }

  stop(): void { }

  stream: ServerHandler<EncodeStreamResponse> = (_, res) => {
    const body: OutputObject = outputHls()
    const { options, format } = body

    const id = uuid()

    const connection = EncodeConnection.create(id, this.outputPrefix, body)
    const segment = connection.defaultSegment(body)
    console.log(this.constructor.name, "stream")
    connection.update(segment)

    // TODO: construct streamUrl
    const response: EncodeStreamResponse = {
      id, readySeconds: 10, streamUrl: `http://localhost:8570/hls/${id}/index.m3u8`
    }
    switch (format) {
      case 'hls': {
        const { hls_time } = options
        if (typeof hls_time !== 'undefined') response.readySeconds = 2 * Number(hls_time)
      }
    }
    console.log(`GET ${this.prefix}`, response)
    res.send(response)
  }

  update: ServerHandler<EncodeUpdateResponse, EncodeUpdateRequest> = (req, res) => {
    const { body } = req
    const { id, segment } = body
    const connection = EncodeConnection.get(id)
    if (!connection) {
      res.sendStatus(404)
      return
    }
    try {
      console.log(`POST ${this.prefix}/${id}`, body)
      const response: EncodeUpdateResponse = connection.update(segment)
      console.log(`POST ${this.prefix}/${id}`, response)
      res.send(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}


export { EncodeServer, EncodeServerArgs }
