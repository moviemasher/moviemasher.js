import Express from "express"
import path from "path"
import fs from 'fs'

import {
  assertDefinitionType, 
  ApiCallback, MediaObject, Endpoints, Errors, OutputType, 
  RenderingStartRequest,
  DefinitionType, 
  RenderingStartResponse,
  LoadType, Endpoint, RequestInitObject, 
  RenderingStatusResponse, RenderingStatusRequest,
  RenderingUploadRequest, RenderingUploadResponse, 
  MashObject, assertTrue, NumberObject, SizePreview, 
  SizeIcon, 
  RenderingInput,
  isLoadType, isDefined, urlBaseInitialize,
  RenderingCommandOutputs,
  RenderingOptions,
  RenderingCommandOutput
} from "@moviemasher/moviemasher.js"
import { 
  expandFile, renderingProcessInstance, RenderingProcessArgs, 
  renderingInput,
  renderingOutputFile, 
  BasenameDefinition,
  ExtensionLoadedInfo,
  BasenameRendering,
  environment,
  Environment,
} from "@moviemasher/server-core"

import { ServerClass } from "../ServerClass"
import { ExpressHandler } from "../Server"
import { HostServers } from "../../Host/Host"


import { RenderingServer, RenderingServerArgs } from "./RenderingServer"
import { FileServer, FileServerFilename } from "../FileServer/FileServer"

import { idUnique } from "../../Utilities/Id"

export type RenderingCommandOutputRecord = {
  [index in OutputType]?: RenderingCommandOutput
}

export class RenderingServerClass extends ServerClass implements RenderingServer {
  constructor(public args: RenderingServerArgs) { super(args) }

  private dataPutCallback(user: string, id: string, renderingId: string, outputs: RenderingCommandOutputs): ApiCallback {
    // const definitionPath = this.definitionFilePath(user, id)
    // if (upload) {
    //   assertTrue(fs.existsSync(definitionPath), definitionPath)
    
    //   const definitionString = expandFile(definitionPath)
    //   const definition: MediaObject = JSON.parse(definitionString)
    //   this.populateDefinition(user, renderingId, definition, outputs)
    //   const callback: ApiCallback = {
    //     endpoint: { pathname: Endpoints.data.definition.put },
    //     init: { body: { definition }}
    //   }
    //   return callback
    // }
    // it's a mash render
    const [output] = outputs
    const mash: MashObject = {
      id, rendering: `${id}/${renderingId}/${output.outputType}.${output.extension || output.format}`
    }
    const callback: ApiCallback = {
      endpoint: { pathname: Endpoints.data.mash.put },
      init: { body: { mash }}
    }
    return callback
  }

  private definitionFilePath(user: string, definitionId: string): string {
    const outputDirectory = this.outputDirectory(user, definitionId)
    const jsonPath = path.join(outputDirectory, `${BasenameDefinition}.json`)
    return jsonPath
  }

  private definitionTypeCommandOutputs(definitionType: DefinitionType): RenderingCommandOutput {
    // const outputs: RenderingCommandOutputs = []
    const { previewSize, iconSize } = this
  
    // TODO: support waveform generation
    // TODO: support font uploading
    switch (definitionType) {
      case DefinitionType.Audio: {
        return ({ outputType: OutputType.Audio })
      }
      case DefinitionType.Image: {
        return ({ outputType: OutputType.Image, ...previewSize })
        // return ({ outputType: OutputType.Image, ...iconSize, basename: 'icon' })
      }
      case DefinitionType.Sequence: {
        return ({ outputType: OutputType.Audio, optional: true })
        // return ({ outputType: OutputType.Image, ...iconSize, basename: 'icon' })
        // return ({ outputType: OutputType.ImageSequence, ...previewSize })
      }
      case DefinitionType.Font: {
        return ({ outputType: OutputType.Font })
      }
    }
    throw new Error(Errors.type)
    // return outputs
  }

  private directoryPromise(user: string, definition: MediaObject): Promise<void> {
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

  // private populateDefinition(user: string, renderingId: string, definition: MediaObject, commandOutputs: RenderingCommandOutputs): void {
  //   const { fileServer } = this
  //   assertTrue(fileServer)

  //   const { id, source, type: definitionType } = definition
  //   assertPopulatedString(id)
  //   assertDefinitionType(definitionType)
  //   assertPopulatedString(source)

  //   const prefix = path.join(fileServer.userUploadPrefix(id, user), renderingId)
  //   const outputDirectory = this.outputDirectory(user, id)
  //   const inInfoName = `upload.${ExtensionLoadedInfo}`
  //   const inInfoPath = path.join(outputDirectory, renderingId, inInfoName)
  //   const inInfoExists = fs.existsSync(inInfoPath)
  //   const inInfo: LoadedInfo = inInfoExists ? expandToJson(inInfoPath) : {}
  //   const { 
  //     width: inWidth, height: inHeight,
  //     duration: inDuration, audible: inAudible, label: inLabel
  //   } = inInfo
  //   if (isUpdatableDurationType(definitionType) && isAboveZero(inDuration)) {
  //     definition.duration = inDuration
  //   }
  //   if (isUpdatableSizeType(definitionType)) {
  //     if (isAboveZero(inWidth) && isAboveZero(inHeight)) {
  //       definition.sourceSize = { width: inWidth, height: inHeight }
  //     }
  //   }
  //   const countByType: NumberObject = {}
  //   commandOutputs.forEach(output => {
  //     const { outputType } = output
  //     if (!isDefined(countByType[outputType])) countByType[outputType] = -1
  //     countByType[outputType]++
  //     const index = countByType[outputType]
  //     const outInfoName = renderingOutputFile(index, output, ExtensionLoadedInfo)
  //     const outInfoPath = path.join(outputDirectory, renderingId, outInfoName)

  //     const outInfo: LoadedInfo = expandToJson(outInfoPath)
  //     const { 
  //       width: outWidth, height: outHeight, 
  //       duration: outDuration, audible: outAudible, extension
  //     } = outInfo
  //     const outputFilename = renderingOutputFile(index, output, extension)
  //     const outUrl = path.join(prefix, outputFilename)
  //     // console.log(this.constructor.name, "populateDefinition", outInfo, index, outputType, outUrl)
  //     switch(outputType) {
  //       // case OutputType.ImageSequence: {
  //       //   if (isAboveZero(outWidth) && isAboveZero(outHeight)) {
  //       //     definition.fps = output.videoRate
  //       //     definition.previewSize = { width: outWidth, height: outHeight }
  //       //     definition.url = prefix + '/'
  //       //   } 
  //       //   break
  //       // }
  //       case OutputType.Audio: {
  //         const { duration: definitionDuration } = definition
  //         if (isAboveZero(outDuration) && isAboveZero(definitionDuration)) {
  //           definition.audio = true
  //           definition.duration = Math.min(definitionDuration, outDuration)
  //           const audioInput = definitionType === DefinitionType.Audio
  //           if (audioInput) definition.url = outUrl
  //           else definition.audioUrl = outUrl
  //         }
  //         break
  //       }
  //       case OutputType.Image: {
  //         if (isAboveZero(outWidth) && isAboveZero(outHeight)) {
  //           const outSize = { width: outWidth, height: outHeight }
  //           const imageInput = definitionType === DefinitionType.Image
  //           if (imageInput && !index) {
  //             definition.previewSize = outSize
  //             definition.url = outUrl
  //           } else definition.icon = outUrl
  //         }
  //         break
  //       }
  //     }
  //   })
  //   // console.log(this.constructor.name, "populateDefinition", definition)
  // }

  private get previewSize() { return this.args.previewSize || SizePreview }
  // private get outputSize() { return this.args.outputSize || SizeOutput }
  private get iconSize() { return this.args.iconSize || SizeIcon }


  // private _renderingCommandOutputs?: UnusedRenderingCommandOutputs
  // private get renderingCommandOutputs(): UnusedRenderingCommandOutputs {
  //   if (this._renderingCommandOutputs) return this._renderingCommandOutputs

  //   const { previewSize, outputSize } = this
  //   const provided = this.args.commandOutputs || {}
  //   const outputs = Object.fromEntries(OutputTypes.map(outputType => {
  //     const base: RenderingCommandOutput = { outputType }
  //     switch (outputType) {
  //       case OutputType.Image: {
  //         base.width = previewSize.width
  //         base.height = previewSize.height
  //         base.cover = true
  //         break
  //       }
  //       case OutputType.Video: {
  //         base.width = outputSize.width
  //         base.height = outputSize.height
  //         break
  //       }
  //     }
  //     const commandOutput: CommandOutput = provided[outputType] || {}
  //     const renderingCommandOutput: RenderingCommandOutput = { ...base, ...commandOutput }
  //     return [outputType, renderingCommandOutput]
  //   }))
  //   return this._renderingCommandOutputs = outputs
  // }

  start: ExpressHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const request = req.body
    const { 
      mash, 
      output, 
      ...rest 
    } = request
    // console.log(this.constructor.name, "start", JSON.stringify(request, null, 2))
    // const commandOutput: RenderingCommandOutput = {}
    // outputs.map(output => {
    //   const { outputType } = output
    //   const commandOutput = { 
    //     ...this.renderingCommandOutputs[outputType], 
    //     ...output
    //   }
    //   return outputDefaultPopulate(commandOutput)
    // })

    const id = mash.id || idUnique()
    const renderingId = idUnique()
    const response: RenderingStartResponse = {
      apiCallback: this.statusCallback(id, renderingId)
    }
    try {
      const user = this.userFromRequest(req)

      urlBaseInitialize('file://' + path.resolve(environment(Environment.API_DIR_FILE_PREFIX), user))
      
      
      const { cacheDirectory, temporaryDirectory } = this.args
      const filePrefix = this.fileServer!.args.uploadsPrefix
      const outputDirectory = this.outputDirectory(user, id, renderingId)
      const processArgs: RenderingProcessArgs = {
        ...rest,
        mash,
        defaultDirectory: user,
        validDirectories: ['shared'],
        cacheDirectory,
        temporaryDirectory,
        outputDirectory,
        filePrefix,
        output
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      renderingProcess.runPromise()
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  private startCallback(definitionObject: MediaObject): ApiCallback {
    const { id, type } = definitionObject
    if (!id) throw Errors.id

    assertDefinitionType(type)

    const output: RenderingCommandOutput = this.definitionTypeCommandOutputs(type)
    const clipObject = {}
    const input: RenderingInput = renderingInput(definitionObject, clipObject)
    const renderingStartRequest: RenderingStartRequest = { 
      ...input, output, upload: true 
    }
    const init: RequestInitObject = { body: renderingStartRequest }
    const endpoint: Endpoint = { pathname: Endpoints.rendering.start }
    const renderingApiCallback: ApiCallback = { endpoint, init }
    return renderingApiCallback
  }

  status: ExpressHandler<RenderingStatusResponse, RenderingStatusRequest> = async (req, res) => {
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
      const { output } = json

      const filenames = fs.readdirSync(outputDirectory)
      const countsByType: NumberObject = {}

      const working = (renderingCommandOutput => {
        // console.log(this.constructor.name, "status output", renderingCommandOutput)
        const { outputType } = renderingCommandOutput
        if (!isDefined(countsByType[outputType])) countsByType[outputType] = -1
        countsByType[outputType]++
        const index = countsByType[outputType]
        response[outputType] ||= { total: 0, completed: 0 }
        const state = response[outputType]!
        state.total++
        const resultFileName = renderingOutputFile(index, renderingCommandOutput, ExtensionLoadedInfo)
        if (filenames.includes(resultFileName)) {
          state.completed++
          return 0
        }
        return 1
      })(output)
      if (working) response.apiCallback = this.statusCallback(id, renderingId)
      else response.apiCallback = this.dataPutCallback(user, id, renderingId, [output])
    } catch (error) { response.error = String(error) }
    // console.log(this.constructor.name, "status response", response)
    res.send(response)
  }

  private statusCallback(id: string, renderingId: string): ApiCallback {
    const statusCallback: ApiCallback = {
      endpoint: { pathname: Endpoints.rendering.status },
      init: { body: { id, renderingId }}
    }
    return statusCallback
  }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file
    if (this.fileServer) {
      app.post(Endpoints.rendering.upload, this.upload)
    }
    app.post(Endpoints.rendering.start, this.start)
    app.post(Endpoints.rendering.status, this.status)
    return Promise.resolve()
  }

  upload: ExpressHandler<RenderingUploadResponse, RenderingUploadRequest> = async (req, res) => {
    const request = req.body
    const { name, type, size } = request
    // console.log(this.constructor.name, "upload", request)
    const response: RenderingUploadResponse = {}

    try {
      const user = this.userFromRequest(req)
      const { fileServer} = this
      assertTrue(fileServer, 'fileServer') 

      const extension = path.extname(name).slice(1).toLowerCase()
      let raw = type.split('/').pop() // audio, video, image, font
      if (raw && !isLoadType(raw)) raw = ''
      raw ||= fileServer.extensionLoadType(extension)

      if (!raw) response.error = Errors.invalid.type
      else if (!fileServer.withinLimits(size, raw)) response.error = Errors.invalid.size
      else {
        const loadType = raw as LoadType
        response.loadType = loadType
        const definitionId = idUnique() // new definition id
        const prefix = fileServer.userUploadPrefix(definitionId, user)
        const source = path.join(prefix, `${FileServerFilename}.${extension}`)
        const definition = renderingDefinitionObject(loadType, source, definitionId, name)
        // id, type, source, label
        await this.directoryPromise(user, definition)

        response.id = definitionId
        response.fileProperty = fileServer.property
        response.fileApiCallback = fileServer.constructCallback(request, user, definitionId)
        response.apiCallback = this.startCallback(definition)
      }
    } catch (error) { response.error = String(error) }
    // console.log(this.constructor.name, "upload response")
    res.send(response)
  }
}
function renderingDefinitionObject(loadType: LoadType, source: string, definitionId: string, name: string): MediaObject {
  throw new Error("Function not implemented.")
}

