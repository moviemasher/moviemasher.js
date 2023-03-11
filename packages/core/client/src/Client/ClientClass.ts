import {
  DataDefinitionPutRequest, DataDefinitionPutResponse, 
  isStorableType, isTyped, mediaTypeFromMime, PotentialError, 
  fileMediaObjectPromise,
  isMediaObject,
  mediaDefinition,
  requestRecordsPromise,
  assertMediaObject,
  MediaDataArrayOrError,
  Emitter,
  Masher,
  MasherOptions,
  Runtime,
  MasherType,
  errorThrow,
  assertMashMedia, 
  isEncodingType, 
  TranslateType, TranslateArgs,
  JsonMimetype, UploadType, requestPopulate,
  assertIdentified, PluginDataOrErrorPromiseFunction,
  Decoding, Encoding, MashMedia, Media, MediaObject, MediaArray, 
  requestRecordPromise, Transcoding, transcodingInstance, VideoType, 
  Request, ErrorName, error, idIsTemporary, assertPopulatedString, isMedia, 
  isVideoMedia, isImageMedia, isUpdatableDurationDefinition, AsteriskChar,
  ProbeType, CommaChar, MediaDataOrError, errorPromise, isDefiniteError, Strings, 
  EncodingTypes, isAboveZero, SlashChar, StorableTypes, pluginDataOrError, 
  PluginDataOrErrorFunction, pluginDataOrErrorPromise, pluginRequest,
} from "@moviemasher/moviemasher.js"
import { translate, translateDefaultLocale, TranslateFunction, translateLocale, translatePluginPromise, translatePromise, TranslatePromiseFunction } from "../Translate/TranslateFunctions"

import { 
  Client, ClientOptions, 
  ClientProgessSteps, 
  clientArgs, Operation, isOperation, Operations, WriteOperation, 
  ClientDecodeMethodArgs, ClientEncodeMethodArgs, ClientSaveMethodArgs, 
  ClientLimits, ClientTranscodeMethodArgs, ClientReadParams, ClientArgs, 
  ImportOperation, PluginOperation, TranslateOperation
} from "./Client"


export class ClientClass implements Client {
  constructor(options?: ClientOptions) {
    this.clientArgs = clientArgs(options)
    this.plugin = pluginDataOrError
    this.pluginPromise = pluginDataOrErrorPromise
    this.translate = translate
    this.translatePromise = translatePromise
    const { 
      [TranslateOperation]: translateArgs, 
      [PluginOperation]: pluginArgs 
    } = this.clientArgs
    if (pluginArgs) {
      const { request } = pluginArgs
      if (request) pluginRequest(request)
      else console.log('no plugin request')
    } else console.log('no plugin args')
    if (translateArgs) {
      const { locale, defaultLocale, autoFetch } = translateArgs
      if (defaultLocale) translateDefaultLocale(defaultLocale)
      if (autoFetch) translatePluginPromise(locale) 
      else if (locale) translateLocale(locale)
    }
  }

  private clientArgs: ClientArgs 

  decode(args: ClientDecodeMethodArgs): Promise<Decoding> {
    return Promise.resolve({ type: ProbeType })
  }
  
  enabled(operation?: Operation): boolean {
    const { clientArgs } = this
    const operations = isOperation(operation) ? [operation] : Operations
    return operations.every(operation => {
      const options = clientArgs[operation]
      const enabled = Boolean(options)
      if (!enabled) console.debug(`ClientClass.enabled(${operation})`, enabled)
      return enabled
    })
  }

  encode(args: ClientEncodeMethodArgs): Promise<Encoding> {
    throw new Error("Method not implemented.")

    // const media = editor.definitions.map(object => object.toJSON()) as MediaObjects
    // const mashObject = mashMedia.toJSON() as MashMediaObject
    // const mash: MashAndMediaObject = { ...mashObject, media }
    // const request: RenderingStartRequest = {
    //   mash,
    //   output: {outputType: VideoType},
    // }
    // console.debug("RenderingStartRequest", Endpoints.rendering.start, request)
    // endpointPromise(Endpoints.rendering.start, request).then((response: RenderingStartResponse) => {
    //   console.debug("RenderingStartResponse", Endpoints.rendering.start, response)
    //   const { apiCallback, error } = response
    //   if (error) handleError(Endpoints.rendering.start, request, response, error.message)
    //   else handleApiCallback(apiCallback!, mashMedia)
    // })
  }

  eventTarget = new Emitter()
  
  get fileAccept(): string { 
    const { clientArgs: args } = this
    const { [ImportOperation]: importArgs } = args
    if (!importArgs) return ''


    const { uploadLimits } = importArgs
    if (!uploadLimits) return ''

    const accept: Strings = []
    EncodingTypes.forEach(type => {
      const limit = uploadLimits[type]
      if (isAboveZero(limit)) accept.push(`${type}${SlashChar}${AsteriskChar}`)
    })
    if (StorableTypes.some(type => isAboveZero(uploadLimits[type]))) {
      accept.push(JsonMimetype)
    }
    return accept.join(CommaChar) 
  }

  private fileError(file: File, uploadLimits: ClientLimits): Promise<PotentialError> {
    const { type: mimetype } = file
    if (mimetype === JsonMimetype) {
      return file.text().then(text => {
        const json = JSON.parse(text)
        if (!isTyped(json)) return error(ErrorName.ImportType, { value: '' })

        const { type } = json
        if (!isStorableType(type)) return error(ErrorName.ImportType, { value: type })

        return this.fileSizeError(file, uploadLimits, type)
      })
    }
    const coreType = mediaTypeFromMime(mimetype)

    if (!isEncodingType(coreType)) return errorPromise(ErrorName.ImportType, { value: coreType || '' })

    return Promise.resolve(this.fileSizeError(file, uploadLimits, coreType))
  }

  private fileSizeError(file: File, uploadLimits: ClientLimits, type: UploadType): PotentialError {
    const { size } = file
    const max = uploadLimits[type]
    if (!isAboveZero(max)) return error(ErrorName.ClientDisabledSave, 'max')
    const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
    if (sizeInMeg > max ) {
      return error(ErrorName.ImportSize, { value: sizeInMeg, limit: max })
    }
    return {}
  }

  // TODO: support limiting by file extension
  fileMedia(file: File): Promise<MediaDataOrError> {
    const { clientArgs } = this
    const { [ImportOperation]: importArgs } = clientArgs
    if (!importArgs) return errorPromise(ErrorName.ClientDisabledSave, 'importArgs')

    const { uploadLimits } = importArgs
    if (!uploadLimits) return errorPromise(ErrorName.ClientDisabledSave, 'limits')

    return this.fileError(file, uploadLimits).then(orError => {
      if (isDefiniteError(orError)) return orError
  
      return fileMediaObjectPromise(file).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: mediaObject } = orError
        return { data: mediaDefinition(mediaObject) }
      })
    })
  }

  //   const { name, size, type } = file
  //   const coreType = mediaTypeFromMime(type) 
  //     console.log('dropFilesFromList file', file, type)
  //   if (!isEncodingType(coreType)) {
  //     infos.push({ label: name, value: coreType, error: 'import.type' })
  //     return
  //   }
    
  //   const max = limitsByType[coreType]
  //   if (exists && !(isAboveZero(max) && max * 1024 * 1024 > size)) {
  //     infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' })
  //     return
  //   }

  //   const ext = name.toLowerCase().split('.').pop()
  //   const extDefined = isPopulatedString(ext)
  //   const exts = extensionsByType[coreType]
  //   if (exists || !extDefined) {
  //     if (!(extDefined && isArray(exts) && exts.includes(ext))) {
  //       infos.push({ label: name, value: ext, error: 'import.extension' })
  //       return
  //     } 
  //   }
  //   infos.push(file)
  // })


       // const fileInfos = dropFilesFromList(files)
    // if (fileInfos.length) {
    //   const errors: UnknownRecord[] = []
    //   const validFiles: File[] = []
    //   const { eventTarget } = masher
    //   fileInfos.forEach(fileInfo => {
    //     if (fileInfo instanceof File) validFiles.push(fileInfo)
    //     else errors.push(fileInfo)
    //   })

    //   if (errors.length) {
    //     errors.forEach(error => {
    //       const id = idGenerate('activity-error')
    //       const info = { id, type: ActivityType.Error, ...error }
    //       eventTarget.emit(EventType.Active, info)
    //     })
    //   }
    //   if (validFiles.length) return masher.addFiles(validFiles, editorIndex)
    // } else console.log('MasherApp.dropFiles no info')
    // return Promise.resolve([])
    // throw new Error("Method not implemented.")


  get(params: ClientReadParams): Promise<MediaDataOrError> {
    const { clientArgs } = this
    const { read } = clientArgs
    if (!read) return errorPromise(ErrorName.ClientDisabledGet)

    const { getRequest } = read
    if (!getRequest) return errorPromise(ErrorName.ClientDisabledGet)

    requestPopulate(getRequest, params)
    return requestRecordPromise(getRequest).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      if (!isMediaObject(data)) return error(ErrorName.Url)
      const media = mediaDefinition(data)
      return { data: media }
    })
  }

  list(params: ClientReadParams): Promise<MediaDataArrayOrError> {
    const { clientArgs } = this
    const { read } = clientArgs
    if (!read) return errorPromise(ErrorName.ClientDisabledList)

    const { listRequest } = read
    if (!listRequest) return errorPromise(ErrorName.ClientDisabledList)

    requestPopulate(listRequest, params)
    return requestRecordsPromise(listRequest).then(orError => {
      if (isDefiniteError(orError)) return orError

      const mediaObjects = orError.data.filter(isMediaObject).map(object => {
        assertMediaObject(object)

        return object
      })
      return { data: mediaObjects.map(mediaDefinition) }
    })
  }

  masher(options: MasherOptions = {}): Masher {
    const masherOptions = { 
      mashingType: VideoType, 
      eventTarget: this.eventTarget,
      ...options,
    }
    const { mashingType } = masherOptions
    const plugin = Runtime.plugins[MasherType][mashingType]
    if (!plugin) errorThrow(mashingType, 'MashingType', 'mashingType')

    return plugin.masher(masherOptions)
  }

  plugin: PluginDataOrErrorFunction 

  pluginPromise: PluginDataOrErrorPromiseFunction


  save(options: ClientSaveMethodArgs): Promise<MediaDataOrError> {
    const { media } = options
    assertMashMedia(media)
    
    const temporaryIds = media.definitionIds.filter(idIsTemporary)
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
  //     if (isMashMedia(mashMedia)) {
  //       return {
  //         mash: mashMedia.toJSON(),
  //         definitionIds: mashMedia.definitionIds
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
    const { clientArgs } = this

    const options = clientArgs[WriteOperation]
    if (!options) return errorPromise(ErrorName.ClientDisabledSave)

    const { saveRequest } = options
    if (!saveRequest) return errorPromise(ErrorName.ClientDisabledSave)


    const requestObject: Request = { ...saveRequest }
    requestObject.init ||= {}
    const definition: MediaObject = { id, ...media.toJSON() }
    const request: DataDefinitionPutRequest = { definition }
    requestObject.init.body = request
    return requestRecordPromise(requestObject).then(result => {
      assertIdentified(result)
      const { id, error } = result as DataDefinitionPutResponse
      steps.step++
      const response: MediaDataOrError = { error, data: media }
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
    const transcodingobject = { type: VideoType, id: '', request: { endpoint: {}}}
    const transcoding = transcodingInstance(transcodingobject)
    return Promise.resolve(transcoding)
  }
  translate: TranslateFunction
  translatePromise: TranslatePromiseFunction

  private updateMedia(mediaObject: MediaObject, mash: MashMedia, media?: Media): Promise<void> {
    
    const {id: newId } = mediaObject
    const id = mediaObject.id || media!.id
    assertPopulatedString(id)

    const target = media || mash.media.fromId(newId!)
    const { id: oldId } = target
    const idChanged = oldId !== id
    console.log(this.constructor.name, "updateDefinition", idChanged, mediaObject)
    if (idChanged) {
      mash.media.updateDefinitionId(target.id, id)
      console.log(this.constructor.name, "updateDefinition called updateDefinitionId", target.id, id)

      // TODO - replace assign
      Object.assign(target, mediaObject)
      
      if (isMedia(target)) {
        delete target.file
        delete target.request.response 
        if (isVideoMedia(target)) {
          delete target.loadedVideo 
        }
        else if (isUpdatableDurationDefinition(target)) delete target.loadedAudio 
        else if (isImageMedia(target)) delete target.loadedImage 
      }    
    } 
    if (!idChanged) return Promise.resolve()
    
    const { tracks } = mash
    const clips = tracks.flatMap(track => track.clips)
    clips.forEach(clip => {
      if (clip.containerId === oldId) clip.setValue(newId, 'containerId')
      if (clip.contentId === oldId) clip.setValue(newId, 'contentId')
    })
    return mash.reload() || Promise.resolve()
  }
  
  protected upload(media: Media, steps: ClientProgessSteps): Promise<MediaDataOrError> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))
    //   const { uploadResponseIsRequest, uploadStorableTypes } = args

  //   if (uploadResponseIsRequest) {

  //   }

  //   const { label, type, clientMedia } = media
  //   if (!clientMedia) return Promise.resolve(error(ErrorName.Internal))
  
  //   if (isEncodingType(type)) {
  //     type
  //   }
  //   switch (type) {
  //     case AudioType:
  //     case ImageType:
  //     case VideoType:
        
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


// let promise = Promise.resolve()

// definitions.forEach(definition => {
//   assertContentDefinition(definition)
//   const { label, type, source } = definition

//   const id = idGenerate('activity')
//   eventTarget.emit(EventType.Active, { id, label, type: ActivityType.Render })

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
  //     const commandOutput: VideoEncoderOptions = provided[outputType] || {}
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
  //         if (steps) eventTarget.emit(EventType.Active, { 
  //           id, step, steps, type: ActivityType.Render 
  //         })
  //       }
        
  //       return delayPromise().then(() => handleApiCallback(id, definition, apiCallback))
  //     }
  //     eventTarget.emit(EventType.Active, { id, type: ActivityType.Complete })
  //   })
  // }

//   const handleError = (endpoint: string, error: string, id: string) => {
//     editor.eventTarget.emit(EventType.Active, { 
//       id, type: ActivityType.Error, error: 'import.render', value: error 
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
//     //   eventTarget.emit(EventType.Active, { id, label, type: ActivityType.Render })

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