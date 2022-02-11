import Express from "express"
import {
  ApiCallback, ClipObject, DefinitionObject, Endpoints, Errors, MashObject, OutputOptions,
  OutputType, RenderingStartRequest, RenderingStartResponse
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { ServerClass } from "../ServerClass"
import { ServerArgs } from "../Server"
import { HostServers } from "../../Host/Host"
import { JobOptions } from "./Job/Job"
import { JobFactory } from "./Job/JobFactory"
import { FileServer } from "../FileServer/FileServer"
import path from "path"

const uuid = require('uuid').v4

interface RenderingServerArgs extends ServerArgs {
  outputDefault: OutputOptions
  renderingDirectory: string
  cacheDirectory: string
}

class RenderingServer extends ServerClass {
  declare args: RenderingServerArgs

  constructCallback(definitionObject: DefinitionObject): ApiCallback {
    const { id } = definitionObject
    if (!id) throw Errors.id

    const clip: ClipObject = { definitionId: id }

    const mash: MashObject = { tracks: [{ clips: [clip] }] }

    const definitions: DefinitionObject[] = [definitionObject]
    const output: OutputOptions = { type: OutputType.Image }
    const outputs: OutputOptions[] = [output]

    const request: RenderingStartRequest = { mash, outputs, definitions }

    const callback: ApiCallback = {
      endpoint: { prefix: Endpoints.rendering.start },
      request: { body: request }
    }
    return callback
  }

  fileServer?: FileServer

  id = 'rendering'

  start: ServerHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const request = req.body
    console.log(this.constructor.name, "start", request)
    const { id } = request
    const jobId = id || uuid()
    const response: RenderingStartResponse = { id: jobId }
    const { renderingDirectory, cacheDirectory } = this.args
    const fileDirectory = path.resolve(this.fileServer!.args.uploadsPrefix)
    const jobOptions: JobOptions = {
      ...request, ...response, renderingDirectory, cacheDirectory, fileDirectory
    }
    try {
      const jobArgs = JobFactory.args(jobOptions)
      const job = JobFactory.instance(jobArgs)
      job.renderPromise()
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file
    app.post(Endpoints.rendering.start, this.start)
  }
}

export { RenderingServer, RenderingServerArgs }
