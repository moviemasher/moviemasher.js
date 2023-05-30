import type {
  MediaDataOrError, EndpointRequest, 
  Decoding, Encoding, Media, MediaObject, MediaArray, Transcoding, 
} from '@moviemasher/lib-core'

import type { ClientOperationArgs } from "./LocalClient.js"

import type {
  ClientDecodeMethodArgs, ClientEncodeMethodArgs, ClientSaveMethodArgs, 
  RemoteClient, RemoteClientOptions, 
  ClientProgessSteps, ClientTranscodeMethodArgs, RemoteClientArgs, 
  DecodeOperation, ClientDecodeArgs, ClientEncodeArgs, ClientTranscodeArgs, 
  ClientUploadArgs, ClientWriteArgs, EncodeOperation, 
  TranscodeOperation, UploadOperation, WriteOperation, 
  Operation, Operations, RemoteOperation, 
} from "./RemoteClient.js"


import {
  assertObject, 
  errorPromise, isDefiniteError, 
  assertMashAsset, 
  assertIdentified, 
  requestRecordPromise, transcodingInstance, 
  ErrorName, error, idIsTemporary, 
  
  TypeVideo, TypeProbe, 
  pluginRequest,
} from '@moviemasher/lib-core'


import { 
  isRemoteOperation, OperationsRemote, OperationWrite, DefaultRemoteClientArgs, 
  OperationDecode, OperationEncode, OperationTranscode, OperationUpload, 
} from "./RemoteClient.js"
import { OperationPlugin } from "./LocalClient.js"

import { localClientArgs, LocalClientClass } from './LocalClientClass.js'


const remoteClientArgs = (options: RemoteClientOptions = {}): RemoteClientArgs => {
  function clientOperationArgs(operation: DecodeOperation, options: RemoteClientOptions): ClientDecodeArgs | false
  function clientOperationArgs(operation: EncodeOperation, options: RemoteClientOptions): ClientEncodeArgs | false
  function clientOperationArgs(operation: TranscodeOperation, options: RemoteClientOptions): ClientTranscodeArgs | false
  function clientOperationArgs(operation: UploadOperation, options: RemoteClientOptions): ClientUploadArgs | false
  function clientOperationArgs(operation: WriteOperation, options: RemoteClientOptions): ClientWriteArgs | false
  function clientOperationArgs(operation: RemoteOperation, options: RemoteClientOptions): ClientOperationArgs | false {
    const { [operation]: clientOptions = {}} = options
    if (clientOptions === false) return clientOptions

    const { [operation]: defaultClientArg } = DefaultRemoteClientArgs
    assertObject(defaultClientArg)

    return { ...defaultClientArg, ...clientOptions }
  }
  return {
    ...localClientArgs(options),
    [OperationDecode]: clientOperationArgs(OperationDecode, options),
    [OperationEncode]: clientOperationArgs(OperationEncode, options),
    [OperationTranscode]: clientOperationArgs(OperationTranscode, options),
    [OperationUpload]: clientOperationArgs(OperationUpload, options),
    [OperationWrite]: clientOperationArgs(OperationWrite, options),
  }
}

export class RemoteClientClass extends LocalClientClass implements RemoteClient {
  constructor(options?: RemoteClientOptions) {
    super(options)


    const { 
      [OperationPlugin]: pluginArgs 
    } = this.remoteClientArgs
    if (pluginArgs) {
      const { request } = pluginArgs
      if (request) pluginRequest(request)
      else console.log('no plugin request')
    } else console.log('no plugin args')
    
  }

  get args(): RemoteClientArgs {
    return this.remoteClientArgs
  }
  private _remoteClientArgs?: RemoteClientArgs
  private get remoteClientArgs(): RemoteClientArgs {
    return this._remoteClientArgs ||= remoteClientArgs(this.options)
  }

  decode(args: ClientDecodeMethodArgs): Promise<Decoding> {
    return Promise.resolve({ type: TypeProbe })
  }
  
  enabled(operation?: Operation | Operations): boolean {
    const { remoteClientArgs: clientArgs } = this
    const operations = isRemoteOperation(operation) ? [operation] : OperationsRemote
    return operations.every(operation => Boolean(clientArgs[operation]))
  }

  encode(args: ClientEncodeMethodArgs): Promise<Encoding> {
    throw new Error("Method not implemented.")

    // const media = editor.definitions.map(object => object.toJSON()) as MediaObjects
    // const mashObject = mashMedia.toJSON() as MashAsset
    // const mash: MashAndMediaObject = { ...mashObject, media }
    // const request: RenderingStartRequest = {
    //   mash,
    //   output: {outputType: TypeVideo},
    // }
    // console.debug("RenderingStartRequest", Endpoints.rendering.start, request)
    // endpointPromise(Endpoints.rendering.start, request).then((response: RenderingStartResponse) => {
    //   console.debug("RenderingStartResponse", Endpoints.rendering.start, response)
    //   const { apiCallback, error } = response
    //   if (error) handleError(Endpoints.rendering.start, request, response, error.message)
    //   else handleApiCallback(apiCallback!, mashMedia)
    // })
  }


  save(options: ClientSaveMethodArgs): Promise<MediaDataOrError> {
    const { media } = options
    assertMashAsset(media)
    
    const temporaryIds = media.assetIds.filter(idIsTemporary)
    const temporaryMedia = temporaryIds.map(id => media.media.fromId(id))

    const steps: ClientProgessSteps = {
      step: 0, steps: 1, mash: media, media: media, completed: 0
    }
    
    return this.saveMedias(temporaryMedia, steps).then(orError => {
      if (isDefiniteError(orError)) return orError

      return this.saveMediaRow(media, steps)
    })
  
  }

  protected saveAutoDecodings(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))
  }

  protected saveAutoTranscodings(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))
  }


    // const definitionsPromise = saveDefinitionsPromise(definitionsUnsaved)
    // const requestPromise = definitionsPromise.then(() => editor.dataPutRequest())
    // const savePromise = requestPromise.then(request => {
    //   // const { mashingType } = editor
    //   console.debug("DataPutRequest", Endpoints.data[mashingType].put, JSON.parse(JSON.stringify(request)))
    //   endpointPromise(Endpoints.data[mashingType].put, request).then((response: DataPutResponse) => {
    //     console.debug("DataPutResponse", Endpoints.data[mashingType].put, response)
    //     const { error, temporaryIdLookup } = response
    //     if (error) console.error(Endpoints.data[mashingType].put, error)
    //     else editor.saved(temporaryIdLookup)
    //   })
    // })


  // dataPutRequest(): Promise<DataPutRequest> {
  //   const { mashMedia, mashingType } = this
  //   assertObject(mashMedia, 'edited')
  //   assertMashingType(mashingType)

  //   // set edit's label if it's empty
  //   const { label } = mashMedia 
  //   if (!isPopulatedString(label)) {
  //     const defaultLabel = Default[mashingType].label
  //     assertPopulatedString(defaultLabel, 'defaultLabel')
  //     mashMedia.setValue(defaultLabel, 'label')
  //   }
  
  //   return mashMedia.putPromise().then(() => {
  //     if (isMashAsset(mashMedia)) {
  //       return {
  //         mash: mashMedia.toJSON(),
  //         assetIds: mashMedia.assetIds
  //       }
  //     } 
  //   })
  // }
  
  protected saveMedia(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    return errorPromise(ErrorName.ClientDisabledDelete)

    // steps.media = media
    // const { autoDecode, autoTranscode } = args

    // const { id, type, transcodings, decodings } = media
    // return this.saveUpload(media, steps).then(result => (
    //   result.error ? result : this.saveAutoDecodings(media, steps)
    // ))

    // if (!decodings.length && autoDecode && autoDecode[type])

    // return this.saveMediaRow(media, steps)

    
  }

  protected saveMediaRow(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    const { id } = media
    const { remoteClientArgs: clientArgs } = this

    const options = clientArgs[OperationWrite]
    if (!options) return errorPromise(ErrorName.ClientDisabledSave)

    const { saveRequest } = options
    if (!saveRequest) return errorPromise(ErrorName.ClientDisabledSave)


    const requestObject: EndpointRequest = { ...saveRequest }
    requestObject.init ||= {}
    const definition: MediaObject = { id, ...media.toJSON() }
    const request = { definition }
    requestObject.init.body = request
    return requestRecordPromise(requestObject).then(result => {
      assertIdentified(result)
      // const { id, error } = result as DataDefinitionPutResponse
      steps.step++
      const response: MediaDataOrError = { ...result, data: media }
      return response
    })
  }

  protected saveMedias(mediaArray: MediaArray, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    const [first, ...rest] = mediaArray

    let promise: Promise<MediaDataOrError> = this.saveMedia(first, steps)
    rest.forEach(media => {
      promise = promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        return this.saveMedia(media, steps)
      })
    })
    return promise
  }

  protected saveUpload(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    const { id } = media
    if (idIsTemporary(id)) return this.upload(media, steps)

    return this.saveMediaRow(media, steps)
  }

  transcode(args: ClientTranscodeMethodArgs): Promise<Transcoding> {
    const transcodingobject = { type: TypeVideo, id: '', request: { endpoint: {}}}
    const transcoding = transcodingInstance(transcodingobject)
    return Promise.resolve(transcoding)
  }

  // private updateMedia(mediaObject: MediaObject, mash: MashAsset, media?: Media): Promise<void> {
    
  //   const {id: newId } = mediaObject
  //   const id = mediaObject.id || media!.id
  //   assertPopulatedString(id)

  //   const target = media || mash.media.fromId(newId!)
  //   const { id: oldId } = target
  //   const idChanged = oldId !== id
  //   console.log(this.constructor.name, "updateDefinition", idChanged, mediaObject)
  //   if (idChanged) {
  //     mash.media.updateDefinitionId(target.id, id)
  //     console.log(this.constructor.name, "updateDefinition called updateDefinitionId", target.id, id)

  //     // TODO - replace assign
  //     Object.assign(target, mediaObject)
      
  //     if (isAsset(target)) {
  //       delete target.file
  //       delete target.request.response 
  //       if (isVideoMedia(target)) {
  //         delete target.loadedVideo 
  //       }
  //       else if (isUpdatableDurationDefinition(target)) delete target.loadedAudio 
  //       else if (isImageMedia(target)) delete target.loadedImage 
  //     }    
  //   } 
  //   if (!idChanged) return Promise.resolve()
    
  //   const { tracks } = mash
  //   const clips = tracks.flatMap(track => track.clips)
  //   clips.forEach(clip => {
  //     if (clip.containerId === oldId) clip.setValue(newId, 'containerId')
  //     if (clip.contentId === oldId) clip.setValue(newId, 'contentId')
  //   })
  //   return mash.reload() || Promise.resolve()
  // }
  
  protected upload(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))
    //   const { uploadResponseIsRequest, uploadTypesStorable } = args

  //   if (uploadResponseIsRequest) {

  //   }

  //   const { label, type } = media
  
  //   if (isEncodingType(type)) {
  //     type
  //   }
  //   switch (type) {
  //     case AudioType:
  //     case ImageType:
  //     case TypeVideo:
        
  //       break
    
  //     default:
  //       break
  //   }


  //   const id = idGenerate('activity')
  
  //   const { rendering } = Endpoints
  //   console.log("Masher fetch", source)
  //   const responsePromise = fetch(source)
  //   const blobPromise = responsePromise.then(response => response.blob())
  //   const filePromise = blobPromise.then(blob => new File([blob], label))
  //   const resultPromise = filePromise.then(file => {
  //     const request: RenderingUploadRequest = { type, name: label, size: file.size }
  //     console.debug("RenderingUploadRequest", rendering.upload, request)
  //     const responsePromise = endpointPromise(rendering.upload, request)
  //     return responsePromise.then((response: RenderingUploadResponse) => {
  //       console.debug("RenderingUploadResponse", rendering.upload, response)
  //       const { error, fileApiCallback, apiCallback, fileProperty } = response
  //       if (error) return handleError(rendering.upload, error, id)
  
  //       else if (fileApiCallback && fileApiCallback.init) {
  //         if (fileProperty) fileApiCallback.init.body![fileProperty] = file
  //         else fileApiCallback.init.body = file
  //         return jsonPromise(fileApiCallback).then((response: FileStoreResponse) => {
  //           console.debug("FileStoreResponse", response)
  //           const { error } = response
  //           if (error) return handleError(fileApiCallback.endpoint.pathname!, error, id)
  
  //           assertObject(apiCallback, 'apiCallback')
  //           return handleApiCallback(id, definition, apiCallback)
  //         })
  //       } 
  //       assertObject(apiCallback, 'apiCallback')
  //       return handleApiCallback(id, definition, apiCallback)
  //     })
  //  })
  }
}


export const remoteClientInstance = (args: RemoteClientOptions = {}): RemoteClient => (
  new RemoteClientClass(args)
)

// let promise = Promise.resolve()

// definitions.forEach(definition => {
//   assertContentDefinition(definition)
//   const { label, type, source } = definition

//   const id = idGenerate('activity')
//   eventTarget.emit(EventTypeActive, { id, label, type: ActivityTypeRender })

//   const { rendering } = Endpoints
//   console.log("Masher fetch", source)
//   const responsePromise = fetch(source)
//   const blobPromise = responsePromise.then(response => response.blob())
//   const filePromise = blobPromise.then(blob => new File([blob], label))
//   const resultPromise = filePromise.then(file => {
//     const request: RenderingUploadRequest = { type, name: label, size: file.size }
//     console.debug("RenderingUploadRequest", rendering.upload, request)
//     const responsePromise = endpointPromise(rendering.upload, request)
//     return responsePromise.then((response: RenderingUploadResponse) => {
//       console.debug("RenderingUploadResponse", rendering.upload, response)
//       const { error, fileApiCallback, apiCallback, fileProperty } = response
//       if (error) return handleError(rendering.upload, error, id)

//       else if (fileApiCallback && fileApiCallback.init) {
//         if (fileProperty) fileApiCallback.init.body![fileProperty] = file
//         else fileApiCallback.init.body = file
//         return jsonPromise(fileApiCallback).then((response: FileStoreResponse) => {
//           console.debug("FileStoreResponse", response)
//           const { error } = response
//           if (error) return handleError(fileApiCallback.endpoint.pathname!, error, id)

//           assertObject(apiCallback, 'apiCallback')
//           return handleApiCallback(id, definition, apiCallback)
//         })
//       } 
//       assertObject(apiCallback, 'apiCallback')
//       return handleApiCallback(id, definition, apiCallback)
//     })
//   })
//   promise = promise.then(() => resultPromise)
// })



// from rendering server class 

  // private populateDefinition(user: string, renderingId: string, definition: MediaObject, commandOutputs: RenderingCommandOutputs): void {
  //   const { fileServer } = this
  //   assertTrue(fileServer)

  //   const { id, source, type: definitionType } = definition
  //   assertPopulatedString(id)
  //   assertMediaType(definitionType)
  //   assertPopulatedString(source)

  //   const prefix = path.join(fileServer.userUploadPrefix(id, user), renderingId)
  //   const outputDirectory = this.outputDirectory(user, id)
  //   const inInfoName = `upload.${ExtensionLoadedInfo}`
  //   const inInfoPath = path.join(outputDirectory, renderingId, inInfoName)
  //   const inInfoExists = fs.existsSync(inInfoPath)
  //   const inInfo: ProbingData = inInfoExists ? expandToJson(inInfoPath) : {}
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
  //   const countByType: NumberRecord = {}
  //   commandOutputs.forEach(output => {
  //     const { outputType } = output
  //     if (!isDefined(countByType[outputType])) countByType[outputType] = -1
  //     countByType[outputType]++
  //     const index = countByType[outputType]
  //     const outInfoName = renderingOutputFile(index, output, ExtensionLoadedInfo)
  //     const outInfoPath = path.join(outputDirectory, renderingId, outInfoName)

  //     const outInfo: ProbingData = expandToJson(outInfoPath)
  //     const { 
  //       width: outWidth, height: outHeight, 
  //       duration: outDuration, audible: outAudible, extension
  //     } = outInfo
  //     const outputFilename = renderingOutputFile(index, output, extension)
  //     const outUrl = path.join(prefix, outputFilename)
  //     // console.log(this.constructor.name, "populateDefinition", outInfo, index, outputType, outUrl)
  //     switch(outputType) {
  //       // case EncodeType.ImageSequence: {
  //       //   if (isAboveZero(outWidth) && isAboveZero(outHeight)) {
  //       //     definition.fps = output.videoRate
  //       //     definition.previewSize = { width: outWidth, height: outHeight }
  //       //     definition.url = prefix + '/'
  //       //   } 
  //       //   break
  //       // }
  //       case EncodeType.Audio: {
  //         const { duration: definitionDuration } = definition
  //         if (isAboveZero(outDuration) && isAboveZero(definitionDuration)) {
  //           definition.audio = true
  //           definition.duration = Math.min(definitionDuration, outDuration)
  //           const audioInput = definitionType === AudioType
  //           if (audioInput) definition.url = outUrl
  //           else definition.audioUrl = outUrl
  //         }
  //         break
  //       }
  //       case EncodeType.Image: {
  //         if (isAboveZero(outWidth) && isAboveZero(outHeight)) {
  //           const outSize = { width: outWidth, height: outHeight }
  //           const imageInput = definitionType === ImageType
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
  // private _renderingCommandOutputs?: UnusedRenderingCommandOutputs
  // private get renderingCommandOutputs(): UnusedRenderingCommandOutputs {
  //   if (this._renderingCommandOutputs) return this._renderingCommandOutputs

  //   const { previewSize, outputSize } = this
  //   const provided = this.args.commandOutputs || {}
  //   const outputs = Object.fromEntries(EncodeTypes.map(outputType => {
  //     const base: RenderingCommandOutput = { outputType }
  //     switch (outputType) {
  //       case EncodeType.Image: {
  //         base.width = previewSize.width
  //         base.height = previewSize.height
  //         break
  //       }
  //       case EncodeType.Video: {
  //         base.width = outputSize.width
  //         base.height = outputSize.height
  //         break
  //       }
  //     }
  //     const commandOutput: VideoOutputOptions = provided[outputType] || {}
  //     const renderingCommandOutput: RenderingCommandOutput = { ...base, ...commandOutput }
  //     return [outputType, renderingCommandOutput]
  //   }))
  //   return this._renderingCommandOutputs = outputs
  // }


  // FROM Masher.tsx

    // const handleApiCallback = (id: string, definition: Media, callback: ApiCallback): Promise<void> => {
  //   console.debug("handleApiCallback request", callback)
  //   const { eventTarget } = editor
  //   return jsonPromise(callback).then((response: ApiCallbackResponse) => {
  //     console.debug("handleApiCallback response", response)
  //     const { apiCallback, error } = response
  //     if (error) return handleError(callback.endpoint.pathname!, error.message, id)

  //     if (apiCallback) {
  //       const { init, endpoint } = apiCallback
  //       if (endpoint.pathname === Endpoints.data.definition.put) {
  //         assertObject(init, 'init')

  //         const { body } = init
  //         assertObject(body, 'body')

  //         const putRequest: DataDefinitionPutRequest = body
  //         const { definition: definitionObject } = putRequest
  //         console.debug("handleApiCallback calling updateDefinition", definitionObject)

  //         editor.updateDefinition(definitionObject, definition)
  //         console.debug("handleApiCallback called updateDefinition")
  //       }
  //       if (callback.endpoint.pathname === Endpoints.rendering.status) {
  //         const statusResponse: RenderingStatusResponse = response
  //         let steps = 0
  //         let step = 0
  //         EncodeTypes.forEach(type => {
  //           const state = statusResponse[type]
  //           if (!state) return

  //           steps += state.total
  //           step += state.completed
  //         })
  //         if (steps) eventTarget.emit(EventTypeActive, { 
  //           id, step, steps, type: ActivityTypeRender 
  //         })
  //       }
        
  //       return delayPromise().then(() => handleApiCallback(id, definition, apiCallback))
  //     }
  //     eventTarget.emit(EventTypeActive, { id, type: ActivityTypeComplete })
  //   })
  // }

//   const handleError = (endpoint: string, error: string, id: string) => {
//     editor.eventTarget.emit(EventTypeActive, { 
//       id, type: ActivityTypeError, error: 'import.render', value: error 
//     })
//     console.error(endpoint, error)
//     return Promise.reject(error)
//   }

//   const saveDefinitionsPromise = (definitions: MediaArray): Promise<void> => {
//     let promise = Promise.resolve()
//     const { eventTarget } = editor
// throw new Error('')
//     // definitions.forEach(definition => {
//     //   assertContentDefinition(definition)
//     //   const { label, type, source } = definition

//     //   const id = idGenerate('activity')
//     //   eventTarget.emit(EventTypeActive, { id, label, type: ActivityTypeRender })

//     //   const { rendering } = Endpoints
//     //   console.log("Masher fetch", source)
//     //   const responsePromise = fetch(source)
//     //   const blobPromise = responsePromise.then(response => response.blob())
//     //   const filePromise = blobPromise.then(blob => new File([blob], label))
//     //   const resultPromise = filePromise.then(file => {
//     //     const request: RenderingUploadRequest = { type, name: label, size: file.size }
//     //     console.debug("RenderingUploadRequest", rendering.upload, request)
//     //     const responsePromise = endpointPromise(rendering.upload, request)
//     //     return responsePromise.then((response: RenderingUploadResponse) => {
//     //       console.debug("RenderingUploadResponse", rendering.upload, response)
//     //       const { error, fileApiCallback, apiCallback, fileProperty } = response
//     //       if (error) return handleError(rendering.upload, error, id)

//     //       else if (fileApiCallback && fileApiCallback.init) {
//     //         if (fileProperty) fileApiCallback.init.body![fileProperty] = file
//     //         else fileApiCallback.init.body = file
//     //         return jsonPromise(fileApiCallback).then((response: FileStoreResponse) => {
//     //           console.debug("FileStoreResponse", response)
//     //           const { error } = response
//     //           if (error) return handleError(fileApiCallback.endpoint.pathname!, error, id)
    
//     //           assertObject(apiCallback, 'apiCallback')
//     //           return handleApiCallback(id, definition, apiCallback)
//     //         })
//     //       } 
//     //       assertObject(apiCallback, 'apiCallback')
//     //       return handleApiCallback(id, definition, apiCallback)
//     //     })
//     //   })
//     //   promise = promise.then(() => resultPromise)
//     // })
//     return promise
//   }

 // const editorLoad = (object?: DataDefaultResponse) => {
  //   const loadObject = object || mashMedia || { mash: { id: idTemporary(), media: [] } }
  //   // const { previewSize: size = previewSize, ...rest } = loadObject
  //   console.log('MasherApp.editorLoad', object, mashMedia, loadObject)

  //   const { current: svg } = svgRef
  //   // const { current: div } = ref
  //   assertObject(svg, 'svg')
  //   // if (sizeAboveZero(size)) elementSetPreviewSize(div, size)
    
  //   editor.svgElement = svg
  //   const { mash } = loadObject
  //   editor.load(mash)
  // }
  // React.useEffect(() => {
  //   console.debug("MasherApp useEffect", requested)

  //   if (!client.enabled(ReadOperation)) {
  //     editorLoad()
  //     return
  //   }
  //   if (!requested) {
  //     setRequested(true)

  //     const request: DataDefaultRequest = {}

  //     console.debug("DataDefaultRequest", Endpoints.data[mashingType].default, request)

  //     const promise = endpointPromise(Endpoints.data[mashingType].default, request)
  //     promise.then((response: DataDefaultResponse) => {
  //       console.debug("DataDefaultResponse", Endpoints.data[mashingType].default, response)
  //       const { previewSize: serverSize = previewSize } = response
  //       console.log("MasherApp DataDefaultResponse", servers.file?.prefix)
        
  //       editorLoad(response)
  //     })
  //   }
  // }, [requested])