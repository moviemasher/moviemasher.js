import Express from "express"
import path from "path"
import fs from 'fs'
import {
  ApiCallback, DefinitionObject, Endpoints, Errors, OutputType, RenderingStartRequest,
  RenderingStartResponse,
  DefinitionType, CommandOutputs,
  RenderingStatusResponse, RenderingStatusRequest, RenderingInput, RenderingOptions,
  LoadType, DefinitionTypes, Endpoint, ApiRequestInit, outputDefaultPopulate,
  RenderingUploadRequest, RenderingUploadResponse, LoadTypes, RenderingCommandOutput, RenderingOutput, LoadedInfo, ExtJson,
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { ServerClass } from "../ServerClass"
import { ServerArgs } from "../Server"
import { HostServers } from "../../Host/Host"
import { RenderingProcessArgs } from "./RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcess/RenderingProcessFactory"
import { FileServer } from "../FileServer/FileServer"
import {
  renderingDefinitionTypeCommandOutputs, renderingDefinitionObject, renderingInput, renderingSource, renderingOutputFile
} from "../../Utilities/Rendering"
import { BasenameDefinition, BasenameRendering, ExtensionLoadedInfo } from "../../Setup/Constants"

const uuid = require('uuid').v4

interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
}

type RenderingCommandOutputObject = {
  [index in OutputType]?: RenderingCommandOutput
}

class RenderingServer extends ServerClass {
  declare args: RenderingServerArgs

  private dataDefinitionPutCallback(user: string, id: string, renderingId: string, outputs: CommandOutputs): ApiCallback {
    const definitionPath = this.definitionFilePath(user, id!)
    const definitionString = fs.readFileSync(definitionPath).toString()
    const definition: DefinitionObject = JSON.parse(definitionString)
    this.definitionObject(user, renderingId, definition, outputs)
    const callback: ApiCallback = {
      endpoint: { prefix: Endpoints.data.definition.put },
      request: { body: { definition }}
    }
    return callback
  }

  private definitionObject(user: string, renderingId: string, definition: DefinitionObject, commandOutputs: CommandOutputs): void {
    const id = definition.id!
    const outputDirectory = this.outputDirectory(user, id)
    const type = definition.type! as DefinitionType
    const source = definition.source!

    const wants: OutputType[] = []
    switch (type) {
      case DefinitionType.Audio: {
        wants.push(OutputType.Waveform)
        // wants.push(OutputType.Audio)
        definition.url = source
        break
      }
      case DefinitionType.VideoSequence: {
        wants.push(OutputType.Audio)
        wants.push(OutputType.Image)
        wants.push(OutputType.ImageSequence)
        break
      }
      case DefinitionType.Video: {
        wants.push(OutputType.Image)
        wants.push(OutputType.Video)
        break
      }
      case DefinitionType.Image: {
        definition.url = definition.icon = source
        break
      }
      case DefinitionType.Font: {
        break
      }
    }

    const has = wants.filter(want => commandOutputs.find(output => output.outputType === want))
    const lastOutputByType: RenderingCommandOutputObject = Object.fromEntries(has.map(type => {
      const outputs = commandOutputs.filter(output => output.outputType === type)
      const commandOutput = outputs[outputs.length - 1]
      return [type, commandOutput]
    }))
    has.forEach(type => {
      console.log(this.constructor.name, "definitionObject", has)
      const commandOutput = lastOutputByType[type]!
      if (type !== OutputType.ImageSequence) {
        const infoFilename = renderingOutputFile(commandOutput, ExtensionLoadedInfo)
        const infoPath = path.join(outputDirectory, renderingId, infoFilename)
        if (fs.existsSync(infoPath)) {
          const infoString = fs.readFileSync(infoPath).toString()
          const info: LoadedInfo = JSON.parse(infoString)
          if (!info.error) {
            Object.entries(info).forEach(([key, value]) => {
              definition[key] ||= value
            })
          }
        }
      }
      const destinationFileName = renderingSource(commandOutput)
      const suffix = [renderingId, destinationFileName].join('/') // support blank filename
      if (fs.existsSync(path.join(outputDirectory, suffix))) {
        definition[this.outputTypeKey(type)] = path.join(id, suffix)
      }
    })

  }

  outputTypeKey(outputType: OutputType): string {
    switch (outputType) {
      case OutputType.Image: return 'icon'
      case OutputType.Video:
      case OutputType.ImageSequence: return 'url'
      default: return outputType
    }
  }

  private definitionFilePath(user: string, definitionId: string): string {
    const outputDirectory = this.outputDirectory(user, definitionId)
    const jsonPath = path.join(outputDirectory, `${BasenameDefinition}.json`)
    return jsonPath
  }

  private directoryPromise(user: string, definition: DefinitionObject): Promise<void> {
    const { id } = definition
    const jsonPath = this.definitionFilePath(user, id!)
    const outputDirectory = path.dirname(jsonPath)

    console.log(this.constructor.name, "directoryPromise", outputDirectory)
    return fs.promises.mkdir(outputDirectory, { recursive: true }).then(() => {
      return fs.promises.writeFile(jsonPath, JSON.stringify(definition, null, 2))
    })
  }

  fileServer?: FileServer

  id = 'rendering'

  private outputDirectory(user?: string, id?: string, renderingId?: string): string {
    const components = [this.fileServer!.args.uploadsPrefix]
    if (user) components.push(user)
    if (id) components.push(id)
    if (renderingId) components.push(renderingId)
    return path.resolve(...components)
  }

  start: ServerHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const request = req.body
    const { mash, outputs } = request
    // console.log(this.constructor.name, "start", JSON.stringify(request, null, 2))
    const commandOutputs = outputs.map(output => outputDefaultPopulate(output))

    const id = mash.id || uuid()
    const renderingId = uuid()
    const response: RenderingStartResponse = {
      apiCallback: this.statusCallback(id, renderingId)
    }
    try {
      const user = this.userFromRequest(req)
      const { cacheDirectory } = this.args
      const filePrefix = this.fileServer!.args.uploadsPrefix
      const outputDirectory = this.outputDirectory(user, id, renderingId)
      const processArgs: RenderingProcessArgs = {
        defaultDirectory: user,
        validDirectories: ['shared'],
        cacheDirectory,
        outputDirectory,
        filePrefix,
        definitions: [],
        ...request,
        outputs: commandOutputs
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      renderingProcess.runPromise()
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  private startCallback(definitionObject: DefinitionObject): ApiCallback {
    const { id, type } = definitionObject
    if (!id) throw Errors.id
    if (!(type && DefinitionTypes.map(String).includes(type))) throw Errors.type + type

    const definitionType = type as DefinitionType
    const outputs: CommandOutputs = renderingDefinitionTypeCommandOutputs(definitionType)
    const input: RenderingInput = renderingInput(definitionObject)
    const renderingStartRequest: RenderingStartRequest = { ...input, outputs }
    const request: ApiRequestInit = { body: renderingStartRequest }
    const endpoint: Endpoint = { prefix: Endpoints.rendering.start }
    const renderingApiCallback: ApiCallback = { endpoint, request }
    return renderingApiCallback
  }

  status: ServerHandler<RenderingStatusResponse, RenderingStatusRequest> = async (req, res) => {
    const request = req.body
    // console.log(this.constructor.name, "status", JSON.stringify(request, null, 2))
    const { id, renderingId } = request
    const response: RenderingStatusResponse = {}
    try {
      const user = this.userFromRequest(req)
      const outputDirectory = this.outputDirectory(user, id, renderingId)
      const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
      const jsonString = fs.readFileSync(jsonPath).toString()
      const json: RenderingOptions = JSON.parse(jsonString)
      const { outputs } = json

      const filenames = fs.readdirSync(outputDirectory)
      const working = outputs.map(renderingCommandOutput => {
        const { outputType } = renderingCommandOutput
        const state = response[outputType] ||= { total: 0, completed: 0 }
        state.total++

        const resultFileName = renderingOutputFile(renderingCommandOutput, ExtensionLoadedInfo)
        if (filenames.includes(resultFileName)) {
          state.completed++
          return 0
        }
        return 1
      })
      if (Math.max(...working)) response.apiCallback = this.statusCallback(id, renderingId)
      else response.apiCallback = this.dataDefinitionPutCallback(user, id, renderingId, outputs)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  statusCallback(id: string, renderingId: string): ApiCallback {
    const statusCallback: ApiCallback = {
      endpoint: { prefix: Endpoints.rendering.status },
      request: { body: { id, renderingId }}
    }
    return statusCallback
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file
    if (this.fileServer) {
      app.post(Endpoints.rendering.upload, this.upload)
    }
    app.post(Endpoints.rendering.start, this.start)
    app.post(Endpoints.rendering.status, this.status)
  }

  upload: ServerHandler<RenderingUploadResponse, RenderingUploadRequest> = async (req, res) => {
    const request = req.body
    const { name, type, size } = request
    console.log(this.constructor.name, "upload", request)
    const response: RenderingUploadResponse = {}

    try {
      const user = this.userFromRequest(req)
      if (!(this.fileServer)) throw Errors.internal + 'servers'

      const extension = path.extname(name).slice(1).toLowerCase()
      let raw = type.split('/').pop() // audio, video, image, font
      if (raw && !LoadTypes.map(String).includes(raw)) raw = ''
      raw ||= this.fileServer.extensionLoadType(extension)

      if (!raw) response.error = Errors.invalid.type
      else if (!this.fileServer.withinLimits(size, raw)) response.error = Errors.invalid.size
      else {
        const loadType = raw as LoadType
        const definitionId = uuid() // new definition id
        const source = this.fileServer.userSourceSuffix(definitionId, extension, loadType, user)
        const definition = renderingDefinitionObject(loadType, source, definitionId, name)
        await this.directoryPromise(user, definition)

        response.id = definitionId
        response.fileProperty = this.fileServer.property
        response.fileApiCallback = this.fileServer.constructCallback(request, user, definitionId)
        response.apiCallback = this.startCallback(definition)
      }
    } catch (error) { response.error = String(error) }
    console.log(this.constructor.name, "upload response")
    res.send(response)
  }
}

export { RenderingServer, RenderingServerArgs }
function definitionTypeFromRaw(loadType: LoadType): DefinitionType {
  throw new Error("Function not implemented.")
}
