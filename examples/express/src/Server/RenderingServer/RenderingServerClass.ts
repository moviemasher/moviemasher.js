import type { EncodingType, OutputOptions, } from '@moviemasher/runtime-shared'
import type { EncodeFinishResponse, RenderingStartRequest, RenderingStartResponse, StatusRequest } from '../../Api/Rendering.js'
import type { HostServers } from '../../Host/Host.js'
import type { ExpressHandler } from '../Server.js'
import type { RenderingServer, RenderingServerArgs } from './RenderingServer.js'

import { EventServerEncode, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, TypeMash, error, errorCaught } from '@moviemasher/runtime-shared'
import Express from 'express'
import { Endpoints } from '../../Api/Endpoints.js'
import { ServerClass } from '../ServerClass.js'
import path from 'path'
import { EnvironmentKeyApiDirFilePrefix, EnvironmentKeyApiDirTemporary, RuntimeEnvironment, renderingOutputFile } from '@moviemasher/lib-server'
import { outputOptions } from '@moviemasher/lib-shared'
import { idUnique } from '../../Utilities/Id.js'
import { JsonExtension } from '@moviemasher/lib-shared'

export type OutputOptionsRecord = {
  [index in EncodingType]?: OutputOptions
}

// const renderingClipFromDefinition = (definition: AssetObject, overrides: ValueRecord = {}): ClipObject => {
//  const { id, type } = definition
//  const { id: _, containerId: suppliedContainerId, ...rest } = overrides
//  const contentId = id || type
//  const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined
//  const containerId = type === 'audio' ? '' : supplied
//  const content: InstanceObject = {...rest}
//  const visibleClipObject: ClipObject = {
//    contentId, content, containerId
//  }
//  if (type === IMAGE) {
//    visibleClipObject.timing = TimingCustom
//    visibleClipObject.frames = 1
//  }
//  // console.log('renderingClipFromDefinition', overrides, visibleClipObject)
//  return visibleClipObject
// }

// const renderingInput = (definition: AssetObject, clipObject: ValueRecord = {}): RenderingInput => {
//  const { type, id } = definition
//  const definitionObject = {
//    ...definition,
//    type//: type === SequenceType ? VideoType : type
//  }
//  const definitions: AssetObjects = [definitionObject]
//  const clip: ClipObject = renderingClipFromDefinition(definitionObject, clipObject)
//  const track: TrackObject = {
//    dense: true,// String(type) !== String(AudioType),
//    clips: [clip]
//  }
//  const tracks: TrackObject[] = [track]
//  const mash: MashAssetObject = { 
//   id, type: VIDEO, source: SourceMash, tracks, assets: definitions }
//  return { mash }
// }

export class RenderingServerClass extends ServerClass implements RenderingServer {
  constructor(public args: RenderingServerArgs) { super(args) }

  id = 'api'

  encode: ExpressHandler<RenderingStartResponse, RenderingStartRequest> = async (req, res) => {
    const { encodingType, mashAssetObject, options } = req.body
    const response: RenderingStartResponse = {}
    try {
      const populatedOptions = outputOptions(encodingType, options)

      const user = this.userFromRequest(req)
      const encodingId = idUnique()
      const filePrefix = RuntimeEnvironment.get(EnvironmentKeyApiDirFilePrefix)
      const fileName = renderingOutputFile(options, encodingType)
      const temporaryDirectory = RuntimeEnvironment.get(EnvironmentKeyApiDirTemporary)
      

      // const validDirectories = RuntimeEnvironment.get(EnvironmentKeyApiDirValid).split(CommaChar)
      // const defaultDirectory = ''
      const outputPath = path.resolve(filePrefix, user, encodingId, fileName)
      const inputPath = path.resolve(temporaryDirectory, encodingId, `${TypeMash}.${JsonExtension}`)
      
      
      const event = new EventServerEncode(encodingType, outputPath, inputPath, populatedOptions, encodingId)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!(promise)) return error(ERROR.Internal)

      response.data = encodingId

    } catch (error) { 
      console.error('RenderingServerClass start', error)
      response.error = errorCaught(error).error
     }
    res.send(response)
  }
  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      app.post(Endpoints.encode.start, this.encode)
      app.post(Endpoints.encode.finish, this.finish)
    })
  }

  finish: ExpressHandler<EncodeFinishResponse, StatusRequest> = async (req, res) => {
    const request = req.body
    // console.log(this.constructor.name, 'status', JSON.stringify(request, null, 2))
    const { id, renderingId } = request
    const response: EncodeFinishResponse = {}
    try {
      const user = this.userFromRequest(req)
    
    } catch (error) { response.error = errorCaught(error).error }
    // console.log(this.constructor.name, 'status response', response)
    res.send(response)
  }
    // const { id, type } = mashAssetObject
    // const request = req.body
    // const { 
    //   mash, 
    //   output, 
    //   ...rest 
    // } = request


    // const id = mash.id || idUnique()
    // const renderingId = idUnique()
    // const response: RenderingStartResponse = {
    //   // apiCallback: this.statusCallback(id, renderingId)
    // }
      // const localPath = ''
      // // const options: OutputOptions = {}
      // const output: EncodeOutput = {
      //   options, type, request: {}
      // }
      // return await encode(localPath, output)

      // const [jobType, mediaRequest] = jobExtract(bodyJson)
      // const response = await jobPromise(jobType, mediaRequest)
      // console.log('RenderingServerClass start', response)
      // res.send(response)
      // return
    //   const user = this.userFromRequest(req)
    //   const prefix = RuntimeEnvironment.get(EnvironmentKeyApiDirFilePrefix)
    //   const urlBase = 'file://' + path.resolve(prefix, user)
    //   RuntimeEnvironment.set(EnvironmentKeyUrlBase, urlBase)
  
    //   const { cacheDirectory, temporaryDirectory } = this.args
    //   const filePrefix = this.args.outputDirectory
    //   const outputDirectory = this.outputDirectory(user, id, renderingId)
    //   const processArgs: RenderingProcessArgs = {
    //     ...rest,
    //     mash,
    //     defaultDirectory: user,
    //     validDirectories: ['shared'],
    //     cacheDirectory,
    //     temporaryDirectory,
    //     outputDirectory,
    //     filePrefix,
    //     outputOptions: output,
    //   }
    //   const renderingProcess = renderingProcessInstance(processArgs)
    //   renderingProcess.runPromise()

}

  // private outputDirectory(user?: string, id?: string, renderingId?: string): string {
  //   const components = [this.args.outputDirectory]
  //   if (user) components.push(user)
  //   if (id) components.push(id)
  //   if (renderingId) components.push(renderingId)
  //   return path.resolve(...components)
  // }
  // private get previewSize() { return this.args.previewSize || SIZE_OUTPUT }
  // private get iconSize() { return this.args.iconSize || SIZE_OUTPUT }


  // private get outputSize() { return this.args.outputSize || SizeOutput }


  // private dataPutCallback(user: string, id: string, renderingId: string, outputs: RenderingCommandOutputs): ApiCallback {
  //   // const definitionPath = this.definitionFilePath(user, id)
  //   // if (upload) {
  //   //   assertTrue(fs.existsSync(definitionPath), definitionPath)
    
  //   //   const definitionString = fileRead(definitionPath)
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

  // private definitionFilePath(user: string, id: string): string {
  //   const outputDirectory = this.outputDirectory(user, id)
  //   const jsonPath = path.join(outputDirectory, `${BasenameDefinition}.json`)
  //   return jsonPath
  // }

  // private definitionTypeCommandOutputs(definitionType: AssetType): RenderingCommandOutput {
  //   // const outputs: RenderingCommandOutputs = []
  //   const { previewSize, iconSize } = this
  
  //   // TODO: support waveform generation
  //   // TODO: support font uploading
  //   // switch (definitionType) {
  //   //   case AudioType: {
  //   //     return ({ outputType: AudioType })
  //   //   }
  //   //   case ImageType: {
  //   //     return ({ outputType: ImageType, ...previewSize })
  //   //     // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
  //   //   }
  //   //   case SequenceType: {
  //   //     return ({ outputType: AudioType })
  //   //     // return ({ outputType: ImageType, ...iconSize, basename: 'icon' })
  //   //     // return ({ outputType: ImageSequenceType, ...previewSize })
  //   //   }
  //     // case FontType: {
  //     //   return ({ outputType: FontType })
  //     // }
  //   // }
  //   return errorThrow(ERROR.Type) 
  //   // return outputs
  // }

  // private directoryPromise(user: string, definition: AssetObject): Promise<void> {
  //   const { id } = definition
  //   const jsonPath = this.definitionFilePath(user, id!)
  //   const outputDirectory = path.dirname(jsonPath)

  //   // console.log(this.constructor.name, 'directoryPromise', outputDirectory)
  //   return fs.promises.mkdir(outputDirectory, { recursive: true }).then(() => {
  //     return fs.promises.writeFile(jsonPath, JSON.stringify(definition, null, 2))
  //   })
  // }

  // fileServer?: FileServer


  // upload: ExpressHandler<RenderingUploadResponse, RenderingUploadRequest> = async (req, res) => {
  //   const request = req.body
  //   const { name, type, size } = request
  //   // console.log(this.constructor.name, 'upload', request)
  //   const response: RenderingUploadResponse = {}

  //   try {
  //     const user = this.userFromRequest(req)
  //     const { fileServer} = this
  //     assertTrue(fileServer, 'fileServer') 

  //     const extension = path.extname(name).slice(1).toLowerCase()
  //     let raw: string | undefined = type.split(SlashChar).shift() // audio, video, image, font
  //     if (raw && !isLoadType(raw)) raw = ''
  //     raw ||= fileServer.extensionLoadType(extension)

  //     if (!raw) response.error = errorName(ERROR.ImportType)
  //     else if (!fileServer.withinLimits(size, raw)) {
  //       response.error = errorName(ERROR.ImportSize, { value: size }) 
  //     } else {
  //       const loadType = raw as LoadType
  //       response.loadType = loadType
  //       const id = idUnique() // new definition id
  //       const prefix = fileServer.userUploadPrefix(id, user)
  //       const source = path.join(prefix, `${FileServerFilename}.${extension}`)
  //       const definition = renderingDefinitionObject(loadType, source, id, name)
  //       // id, type, source, label
  //       await this.directoryPromise(user, definition)

  //       response.id = id
  //       response.fileProperty = fileServer.property
  //       response.fileApiCallback = fileServer.constructCallback(request, user, id)
  //       response.apiCallback = this.startCallback(definition)
  //     }
  //   } catch (error) { response.error = errorCaught(error).error }
  //   // console.log(this.constructor.name, 'upload response')
  //   res.send(response)
  // }
  // private startCallback(definitionObject: AssetObject): ApiCallback {
  //   const { id, type } = definitionObject
  //   if (!id) return errorThrow(ERROR.AssetId) 

  //   assertAssetType(type)

  //   const output: RenderingCommandOutput = this.definitionTypeCommandOutputs(type)
  //   const clipObject = {}
  //   const input: RenderingInput = renderingInput(definitionObject, clipObject)
  //   const renderingStartRequest: RenderingStartRequest = { 
  //     outputOptions: {},
  //     encodingType: type,
  //     ...input, output, upload: true 
  //   }
  //   const init: RequestInit = { body: renderingStartRequest }
  //   const endpoint: Endpoint = { pathname: Endpoints.rendering.start }
  //   const renderingApiCallback: ApiCallback = { endpoint, init }
  //   return renderingApiCallback
  // }


  // private statusCallback(id: string, renderingId: string): ApiCallback {
  //   const statusCallback: ApiCallback = {
  //     endpoint: { pathname: Endpoints.rendering.status },
  //     init: { body: { id, renderingId }}
  //   }
  //   return statusCallback
  // }