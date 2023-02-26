import Express from "express"
import path from "path"
import fs from 'fs'

import {
  assertMediaType, 
  ApiCallback, MediaObject, Endpoints, EncodingType, 
  RenderingStartRequest,
  MediaType, 
  RenderingStartResponse,
  LoadType, Endpoint, RequestInit, 
  
  RenderingUploadRequest, RenderingUploadResponse, 
  MashMediaObject, assertTrue, SizePreview, 
  SizeIcon, 
  RenderingInput,
  isLoadType, urlBaseInitialize,
  RenderingCommandOutputs,
  RenderingCommandOutput,
  AudioType,
  ImageType,
  SequenceType,
  FontType,
  errorCaught, mediaTypeFromMime, ErrorName, errorName, errorThrow
} from "@moviemasher/moviemasher.js"
import { 
  renderingProcessInstance, RenderingProcessArgs, 
  renderingInput,
  BasenameDefinition,
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
  [index in EncodingType]?: RenderingCommandOutput
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
    const mash: MashMediaObject = {
      id, rendering: `${id}/${renderingId}/${output.outputType}.${output.extension || output.format}`
    }
    const callback: ApiCallback = {
      endpoint: { pathname: Endpoints.data.mash.put },
      init: { body: { mash }}
    }
    return callback
  }

  private definitionFilePath(user: string, id: string): string {
    const outputDirectory = this.outputDirectory(user, id)
    const jsonPath = path.join(outputDirectory, `${BasenameDefinition}.json`)
    return jsonPath
  }

  private definitionTypeCommandOutputs(definitionType: MediaType): RenderingCommandOutput {
    // const outputs: RenderingCommandOutputs = []
    const { previewSize, iconSize } = this
  
    // TODO: support waveform generation
    // TODO: support font uploading
    switch (definitionType) {
      case AudioType: {
        return ({ outputType: AudioType })
      }
      case ImageType: {
        return ({ outputType: ImageType, ...previewSize })
        // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
      }
      case SequenceType: {
        return ({ outputType: AudioType, optional: true })
        // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
        // return ({ outputType: ImageSequenceType, ...previewSize })
      }
      case FontType: {
        return ({ outputType: FontType })
      }
    }
    return errorThrow(ErrorName.Type) 
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


  private get previewSize() { return this.args.previewSize || SizePreview }
  // private get outputSize() { return this.args.outputSize || SizeOutput }
  private get iconSize() { return this.args.iconSize || SizeIcon }




  start: ExpressHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const request = req.body
    const { 
      mash, 
      output, 
      ...rest 
    } = request


    const id = mash.id || idUnique()
    const renderingId = idUnique()
    const response: RenderingStartResponse = {
      // apiCallback: this.statusCallback(id, renderingId)
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
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  private startCallback(definitionObject: MediaObject): ApiCallback {
    const { id, type } = definitionObject
    if (!id) return errorThrow(ErrorName.MediaId) 

    assertMediaType(type)

    const output: RenderingCommandOutput = this.definitionTypeCommandOutputs(type)
    const clipObject = {}
    const input: RenderingInput = renderingInput(definitionObject, clipObject)
    const renderingStartRequest: RenderingStartRequest = { 
      ...input, output, upload: true 
    }
    const init: RequestInit = { body: renderingStartRequest }
    const endpoint: Endpoint = { pathname: Endpoints.rendering.start }
    const renderingApiCallback: ApiCallback = { endpoint, init }
    return renderingApiCallback
  }

  // status: ExpressHandler<RenderingStatusResponse, RenderingStatusRequest> = async (req, res) => {
  //   const request = req.body
  //   // console.log(this.constructor.name, "status", JSON.stringify(request, null, 2))
  //   const { id, renderingId } = request
  //   const response: RenderingStatusResponse = {}
  //   try {
  //     const user = this.userFromRequest(req)
  //     const outputDirectory = this.outputDirectory(user, id, renderingId)
  //     const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
  //     const jsonString = expandFile(jsonPath)
  //     const json: RenderingOptions = JSON.parse(jsonString)
  //     const { output } = json

  //     const filenames = fs.readdirSync(outputDirectory)
  //     const countsByType: NumberRecord = {}

  //     const working = (renderingCommandOutput => {
  //       // console.log(this.constructor.name, "status output", renderingCommandOutput)
  //       const { outputType } = renderingCommandOutput
  //       if (!isDefined(countsByType[outputType])) countsByType[outputType] = -1
  //       countsByType[outputType]++
  //       const index = countsByType[outputType]
  //       response[outputType] ||= { total: 0, completed: 0 }
  //       const state = response[outputType]!
  //       state.total++
  //       const resultFileName = renderingOutputFile(index, renderingCommandOutput, ExtensionLoadedInfo)
  //       if (filenames.includes(resultFileName)) {
  //         state.completed++
  //         return 0
  //       }
  //       return 1
  //     })(output)
  //     if (working) response.apiCallback = this.statusCallback(id, renderingId)
  //     else response.apiCallback = this.dataPutCallback(user, id, renderingId, [output])
  //   } catch (error) { response.error = errorCaught(error).error }
  //   // console.log(this.constructor.name, "status response", response)
  //   res.send(response)
  // }

  // private statusCallback(id: string, renderingId: string): ApiCallback {
  //   const statusCallback: ApiCallback = {
  //     endpoint: { pathname: Endpoints.rendering.status },
  //     init: { body: { id, renderingId }}
  //   }
  //   return statusCallback
  // }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file
    if (this.fileServer) {
      app.post(Endpoints.rendering.upload, this.upload)
    }
    app.post(Endpoints.rendering.start, this.start)
    // app.post(Endpoints.rendering.status, this.status)
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
      let raw: string | undefined = mediaTypeFromMime(type) // audio, video, image, font
      if (raw && !isLoadType(raw)) raw = ''
      raw ||= fileServer.extensionLoadType(extension)

      if (!raw) response.error = errorName(ErrorName.ImportType)
      else if (!fileServer.withinLimits(size, raw)) {
        response.error = errorName(ErrorName.ImportType, { value: size }) 
      } else {
        const loadType = raw as LoadType
        response.loadType = loadType
        const id = idUnique() // new definition id
        const prefix = fileServer.userUploadPrefix(id, user)
        const source = path.join(prefix, `${FileServerFilename}.${extension}`)
        const definition = renderingDefinitionObject(loadType, source, id, name)
        // id, type, source, label
        await this.directoryPromise(user, definition)

        response.id = id
        response.fileProperty = fileServer.property
        response.fileApiCallback = fileServer.constructCallback(request, user, id)
        response.apiCallback = this.startCallback(definition)
      }
    } catch (error) { response.error = errorCaught(error).error }
    // console.log(this.constructor.name, "upload response")
    res.send(response)
  }
}
function renderingDefinitionObject(loadType: LoadType, source: string, id: string, name: string): MediaObject {
  throw new Error("Function not implemented.")
}

