import Express from "express"
import {
  ApiCallback, DefinitionObject, Endpoints, Errors, OutputType, RenderingStartRequest,
  RenderingStartResponse,
  DefinitionType, CommandOutputs,
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { ServerClass } from "../ServerClass"
import { ServerArgs } from "../Server"
import { HostServers } from "../../Host/Host"
import { RenderingProcessArgs } from "./RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcess/RenderingProcessFactory"
import { FileServer } from "../FileServer/FileServer"
import path from "path"
import { renderingInputFromDefinition } from "../../Utilities/RenderingInput"

const uuid = require('uuid').v4

interface RenderingServerArgs extends ServerArgs {
  renderingDirectory: string
  cacheDirectory: string
}

class RenderingServer extends ServerClass {
  declare args: RenderingServerArgs

  constructCallback(definitionObject: DefinitionObject): ApiCallback {
    const { id, type } = definitionObject
    if (!id) throw Errors.id
    if (!type) throw Errors.type

    const outputs: CommandOutputs = []
    switch (type) {
      case DefinitionType.Audio: {
        outputs.push({ outputType: OutputType.Audio })
        outputs.push({ outputType: OutputType.Waveform })
        break
      }
      case DefinitionType.Image: {
        outputs.push({ outputType: OutputType.Image })
        break
      }
      case DefinitionType.VideoSequence: {
        outputs.push({ outputType: OutputType.Audio })
        outputs.push({ outputType: OutputType.Waveform })
        outputs.push({ outputType: OutputType.VideoSequence })
        break
      }
    }

    const renderingInput = renderingInputFromDefinition(definitionObject)

    const request: RenderingStartRequest = { ...renderingInput, outputs }

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
    try {
      const user = this.userFromRequest(req)
      const { renderingDirectory, cacheDirectory } = this.args
      const fileDirectory = this.fileServer!.args.uploadsPrefix
      // const userFileDirectory = path.resolve(fileDirectory, user)
      const userRenderingDirectory = path.resolve(renderingDirectory, user)
      const renderingOptions: RenderingProcessArgs = {
        definitions: [],
        ...request, ...response,
        cacheDirectory,
        renderingDirectory: userRenderingDirectory,
        fileDirectory
      }
      const job = renderingProcessInstance(renderingOptions)
      job.runPromise()
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
