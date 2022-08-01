import Express from "express"
import path from "path"
import fs from 'fs'

import {
  assertDefinitionType, assertPopulatedString,
  ApiCallback, DefinitionObject, Endpoints, Errors, OutputType, RenderingStartRequest,
  DefinitionType, CommandOutputs,
  LoadedInfo, OutputTypes, CommandOutput, RenderingStartResponse,
  LoadType, DefinitionTypes, Endpoint, ApiRequestInit, outputDefaultPopulate,
  RenderingStatusResponse, RenderingStatusRequest, RenderingInput, RenderingOptions,
  RenderingUploadRequest, RenderingUploadResponse, LoadTypes, RenderingCommandOutput, MashObject, assertTrue, NumberObject,
} from "@moviemasher/moviemasher.js"

import { ServerClass } from "../ServerClass"
import { ServerHandler } from "../Server"
import { HostServers } from "../../Host/Host"
import { RenderingProcessArgs } from "./RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcess/RenderingProcessFactory"
import {
  renderingDefinitionTypeCommandOutputs, renderingDefinitionObject, renderingInput,
  renderingSource, renderingOutputFile
} from "../../Utilities/Rendering"
import {
  BasenameDefinition, BasenameRendering, ExtensionLoadedInfo
} from "../../Setup/Constants"
import { RenderingCommandOutputs, RenderingServer, RenderingServerArgs } from "./RenderingServer"
import { FileServer } from "../FileServer/FileServer"
import { expandFile } from "../../Utilities/Expand"

import { idUnique } from "../../Utilities/Id"


export class RenderingServerClass extends ServerClass implements RenderingServer {
  constructor(public args: RenderingServerArgs) { super(args) }

  private dataPutCallback(upload: boolean, user: string, id: string, renderingId: string, outputs: CommandOutputs): ApiCallback {
    const definitionPath = this.definitionFilePath(user, id)
    if (upload) {
      assertTrue(fs.existsSync(definitionPath), definitionPath)
    
      const definitionString = expandFile(definitionPath)
      const definition: DefinitionObject = JSON.parse(definitionString)
      this.populateDefinition(user, renderingId, definition, outputs)
      const callback: ApiCallback = {
        endpoint: { prefix: Endpoints.data.definition.put },
        request: { body: { definition }}
      }
      return callback
    }
    // it's a mash render
    const [output] = outputs
    const mash: MashObject = {
      id, rendering: `${id}/${renderingId}/${output.outputType}.${output.extension || output.format}`
    }
    const callback: ApiCallback = {
      endpoint: { prefix: Endpoints.data.mash.put },
      request: { body: { mash }}
    }
    return callback
  }

  private populateDefinition(user: string, renderingId: string, definition: DefinitionObject, commandOutputs: CommandOutputs): void {
    const id = definition.id!
    const outputDirectory = this.outputDirectory(user, id)
    const { type, source } = definition
    assertDefinitionType(type)
    assertPopulatedString(source)

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
    const byType: NumberObject = {}
    const infoFilenamesByType = Object.fromEntries(commandOutputs.map(output => {
      const {outputType} = output
      byType[outputType] ||= -1
      byType[outputType]++
      const index = byType[outputType]
      return [outputType, renderingOutputFile(index, output, ExtensionLoadedInfo)]
    }))
    const has = wants.filter(want => commandOutputs.find(output => output.outputType === want))
    const lastOutputByType: RenderingCommandOutputs = Object.fromEntries(has.map(type => {
      const outputs = commandOutputs.filter(output => output.outputType === type)
      const commandOutput = outputs[outputs.length - 1]
      return [type, commandOutput]
    }))
    has.forEach(type => {
      const infoFilename = infoFilenamesByType[type]
      const infoPath = path.join(outputDirectory, renderingId, infoFilename)
      assertTrue(fs.existsSync(infoPath), infoPath)
     
      const infoString = expandFile(infoPath)
      const info: LoadedInfo = JSON.parse(infoString)
      const { error } = info
      if (error) return
      
      Object.entries(info).forEach(([key, value]) => {
        definition[key] ||= value
      })
  


      const commandOutput = lastOutputByType[type]!
      switch(type) {
        case OutputType.ImageSequence: break

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

    // console.log(this.constructor.name, "directoryPromise", outputDirectory)
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

  _renderingCommandOutputs?: RenderingCommandOutputs
  get renderingCommandOutputs(): RenderingCommandOutputs {
    if (this._renderingCommandOutputs) return this._renderingCommandOutputs

    const { previewSize, outputSize } = this.args
    const provided = this.args.commandOutputs || {}
    const outputs = Object.fromEntries(OutputTypes.map(outputType => {
      const base: RenderingCommandOutput = { outputType }
      switch (outputType) {
        case OutputType.Image:
        case OutputType.ImageSequence: {
          if (previewSize) {
            base.videoWidth = previewSize.width
            base.videoHeight = previewSize.height
          }
          break
        }
        case OutputType.Video: {
          if (outputSize) {
            base.videoWidth = outputSize.width
            base.videoHeight = outputSize.height
          }
          break
        }
      }
      const commandOutput: CommandOutput = provided[outputType] || {}
      const renderingCommandOutput: RenderingCommandOutput = { ...base, commandOutput }
      return [outputType, renderingCommandOutput]
    }))
    return this._renderingCommandOutputs = outputs
  }

  start: ServerHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const request = req.body
    const { mash, outputs, definitions = [], upload = false, ...rest } = request
    // console.log(this.constructor.name, "start", JSON.stringify(request, null, 2))
    const commandOutputs = outputs.map(output => {
      const { outputType } = output
      const commandOutput = {...this.renderingCommandOutputs[outputType], ...output}
      return outputDefaultPopulate(commandOutput)
    })

    const id = mash.id || idUnique()
    const renderingId = idUnique()
    const response: RenderingStartResponse = {
      apiCallback: this.statusCallback(id, renderingId)
    }
    try {
      const user = this.userFromRequest(req)
      const { cacheDirectory } = this.args
      const filePrefix = this.fileServer!.args.uploadsPrefix
      const outputDirectory = this.outputDirectory(user, id, renderingId)
      const processArgs: RenderingProcessArgs = {
        ...rest,
        upload, mash,
        defaultDirectory: user,
        validDirectories: ['shared'],
        cacheDirectory,
        outputDirectory,
        filePrefix,
        definitions,
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

    assertDefinitionType(type)

    const outputs: CommandOutputs = renderingDefinitionTypeCommandOutputs(type)
    const input: RenderingInput = renderingInput(definitionObject)
    const renderingStartRequest: RenderingStartRequest = { 
      ...input, outputs, upload: true 
    }
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
      const jsonString = expandFile(jsonPath)
      const json: RenderingOptions = JSON.parse(jsonString)
      const { outputs, upload } = json

      const filenames = fs.readdirSync(outputDirectory)
      const byType: NumberObject = {}

      const working = outputs.map(renderingCommandOutput => {
        // console.log(this.constructor.name, "status output", renderingCommandOutput)
        const { outputType } = renderingCommandOutput
        byType[outputType] ||= -1
        byType[outputType]++
        const index = byType[outputType]
        response[outputType] ||= { total: 0, completed: 0 }
        const state = response[outputType]!
        state.total++
        const resultFileName = renderingOutputFile(index, renderingCommandOutput, ExtensionLoadedInfo)
        if (filenames.includes(resultFileName)) {
          state.completed++
          return 0
        }
        return 1
      })
      if (Math.max(...working)) response.apiCallback = this.statusCallback(id, renderingId)
      else response.apiCallback = this.dataPutCallback(!!upload, user, id, renderingId, outputs)
    } catch (error) { response.error = String(error) }
    // console.log(this.constructor.name, "status response", response)
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
    // console.log(this.constructor.name, "upload", request)
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
        response.loadType = loadType
        const definitionId = idUnique() // new definition id
        const source = this.fileServer.userSourceSuffix(definitionId, extension, loadType, user)
        const definition = renderingDefinitionObject(loadType, source, definitionId, name)
        await this.directoryPromise(user, definition)

        response.id = definitionId
        response.fileProperty = this.fileServer.property
        response.fileApiCallback = this.fileServer.constructCallback(request, user, definitionId)
        response.apiCallback = this.startCallback(definition)
      }
    } catch (error) { response.error = String(error) }
    // console.log(this.constructor.name, "upload response")
    res.send(response)
  }
}
