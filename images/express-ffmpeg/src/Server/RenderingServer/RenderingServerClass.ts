import type { RenderingCommandOutput, RenderingProcessArgs, } from "@moviemasher/lib-server"
import type { OutputOptions, RenderingInput, } from "@moviemasher/lib-shared"
import type { AssetObject, AssetObjects, AssetType, ClipObject, EncodingType, InstanceObject, LoadType, MashAssetObject, TrackObject, } from "@moviemasher/runtime-shared"
import type { ApiCallback } from "../../Api/Api.js"
import type { RenderingStartRequest, RenderingStartResponse, RenderingUploadRequest, RenderingUploadResponse } from "../../Api/Rendering.js"
import type { HostServers } from "../../Host/Host.js"
import type { FileServer } from "../FileServer/FileServer.js"
import type { ExpressHandler } from "../Server.js"
import type { RenderingServer, RenderingServerArgs } from "./RenderingServer.js"


import { BasenameDefinition, EnvironmentKeyApiDirFilePrefix, renderingProcessInstance } from "@moviemasher/lib-server"
import { EnvironmentKeyUrlBase, Runtime, SlashChar, TimingCustom, assertTrue, isLoadType, } from "@moviemasher/lib-shared"
import { Endpoint, ErrorName, RequestInit, SIZE_OUTPUT, SourceMash, TypeImage, TypeVideo, ValueRecord, assertAssetType, errorCaught, errorName, errorThrow, } from '@moviemasher/runtime-shared'
import Express from "express"
import fs from 'fs'
import path from "path"
import { Endpoints } from "../../Api/Endpoints.js"
import { idUnique } from "../../Utilities/Id.js"
import { FileServerFilename } from "../FileServer/FileServer.js"
import { ServerClass } from "../ServerClass.js"

export type OutputOptionsRecord = {
  [index in EncodingType]?: OutputOptions
}

const renderingClipFromDefinition = (definition: AssetObject, overrides: ValueRecord = {}): ClipObject => {
 const { id, type } = definition
 const { id: _, containerId: suppliedContainerId, ...rest } = overrides
 const contentId = id || type
 const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined
 const containerId = type === 'audio' ? '' : supplied
 const content: InstanceObject = {...rest}
 const visibleClipObject: ClipObject = {
   contentId, content, containerId
 }
 if (type === TypeImage) {
   visibleClipObject.timing = TimingCustom
   visibleClipObject.frames = 1
 }
 // console.log("renderingClipFromDefinition", overrides, visibleClipObject)
 return visibleClipObject
}

const renderingInput = (definition: AssetObject, clipObject: ValueRecord = {}): RenderingInput => {
 const { type, id } = definition
 const definitionObject = {
   ...definition,
   type//: type === SequenceType ? VideoType : type
 }
 const definitions: AssetObjects = [definitionObject]
 const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
 const track: TrackObject = {
   dense: true,// String(type) !== String(AudioType),
   clips: [clip]
 }
 const tracks: TrackObject[] = [track]
 const mash: MashAssetObject = { 
  id, type: TypeVideo, source: SourceMash, tracks, media: definitions }
 return { mash }
}

export class RenderingServerClass extends ServerClass implements RenderingServer {
  constructor(public args: RenderingServerArgs) { super(args) }

  // private dataPutCallback(user: string, id: string, renderingId: string, outputs: RenderingCommandOutputs): ApiCallback {
  //   // const definitionPath = this.definitionFilePath(user, id)
  //   // if (upload) {
  //   //   assertTrue(fs.existsSync(definitionPath), definitionPath)
    
  //   //   const definitionString = expandFile(definitionPath)
  //   //   const definition: AssetObject = JSON.parse(definitionString)
  //   //   this.populateDefinition(user, renderingId, definition, outputs)
  //   //   const callback: ApiCallback = {
  //   //     endpoint: { pathname: Endpoints.data.definition.put },
  //   //     init: { body: { definition }}
  //   //   }
  //   //   return callback
  //   // }
  //   // it's a mash render
  //   const [output] = outputs
  //   const mash: MashAssetObject = {
  //     id, rendering: `${id}/${renderingId}/${output.outputType}.${output.extension || output.format}`
  //   }
  //   const callback: ApiCallback = {
  //     endpoint: { pathname: Endpoints.data.mash.put },
  //     init: { body: { mash }}
  //   }
  //   return callback
  // }

  private definitionFilePath(user: string, id: string): string {
    const outputDirectory = this.outputDirectory(user, id)
    const jsonPath = path.join(outputDirectory, `${BasenameDefinition}.json`)
    return jsonPath
  }

  private definitionTypeCommandOutputs(definitionType: AssetType): RenderingCommandOutput {
    // const outputs: RenderingCommandOutputs = []
    const { previewSize, iconSize } = this
  
    // TODO: support waveform generation
    // TODO: support font uploading
    // switch (definitionType) {
    //   case AudioType: {
    //     return ({ outputType: AudioType })
    //   }
    //   case ImageType: {
    //     return ({ outputType: ImageType, ...previewSize })
    //     // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
    //   }
    //   case SequenceType: {
    //     return ({ outputType: AudioType })
    //     // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
    //     // return ({ outputType: ImageSequenceType, ...previewSize })
    //   }
      // case FontType: {
      //   return ({ outputType: FontType })
      // }
    // }
    return errorThrow(ErrorName.Type) 
    // return outputs
  }

  private directoryPromise(user: string, definition: AssetObject): Promise<void> {
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


  private get previewSize() { return this.args.previewSize || SIZE_OUTPUT }
  // private get outputSize() { return this.args.outputSize || SizeOutput }
  private get iconSize() { return this.args.iconSize || SIZE_OUTPUT }




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
      const { environment } = Runtime
      const prefix = environment.get(EnvironmentKeyApiDirFilePrefix)
      const urlBase = 'file://' + path.resolve(prefix, user)
      environment.set(EnvironmentKeyUrlBase, urlBase)
  
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
        outputOptions: output,
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      renderingProcess.runPromise()
    } catch (error) { 
      // response.error = errorCaught(error).error
     }
    res.send(response)
  }

  private startCallback(definitionObject: AssetObject): ApiCallback {
    const { id, type } = definitionObject
    if (!id) return errorThrow(ErrorName.MediaId) 

    assertAssetType(type)

    const output: RenderingCommandOutput = this.definitionTypeCommandOutputs(type)
    const clipObject = {}
    const input: RenderingInput = renderingInput(definitionObject, clipObject)
    const renderingStartRequest: RenderingStartRequest = { 
      outputOptions: {},
      encodingType: type,
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
  //       const resultFileName = renderingOutputFile(renderingCommandOutput, ExtensionLoadedInfo)
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
      let raw: string | undefined = type.split(SlashChar).shift() // audio, video, image, font
      if (raw && !isLoadType(raw)) raw = ''
      raw ||= fileServer.extensionLoadType(extension)

      if (!raw) response.error = errorName(ErrorName.ImportType)
      else if (!fileServer.withinLimits(size, raw)) {
        response.error = errorName(ErrorName.ImportSize, { value: size }) 
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
function renderingDefinitionObject(loadType: LoadType, source: string, id: string, name: string): AssetObject {
  throw new Error("Function not implemented.")
}

