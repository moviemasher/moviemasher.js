import { 
  assertIdentified, DataDefinitionPutRequest, DataDefinitionPutResponse, 
  Decoding, Encoding, isMashMedia, MashMedia, Media, MediaObject, MediaArray, 
  requestJsonPromise, Transcoding, transcodingInstance, VideoType, isRawMedia,
  RequestObject, ErrorName, error, idIsTemporary, assertRequestObject, AudioType, ImageType, isRawType, urlIsBlob, assertTrue, assertPopulatedString, isMedia, isVideoDefinition, isImageDefinition, isUpdatableDurationDefinition, assertObject, PotentialError, 
} from "@moviemasher/moviemasher.js"

import { 
  Client, ClientOptions, ClientDecodeOptions, ClientEncodeOptions, 
  ClientReadOptions, ClientSaveOptions, ClientTranscodeOptions, 
  ClientObjectResponse, ClientProgessSteps, ClientArrayResponse, 
  ClientDefaultArgs, ClientArgs, Operation, isOperation, Operations, WriteOperation, ClientWriteOptions 
} from "./Client"


export class ClientClass implements Client {
  constructor(public options?: ClientOptions) {}

  enabled(operation?: Operation): boolean {
    const operations = isOperation(operation) ? [operation] : Operations
    return operations.every(operation => {

    })
  }


  media(args: ClientReadOptions): Promise<ClientArrayResponse> {
    throw new Error("Method not implemented.")
  }
  save(media: Media, options?: ClientSaveOptions): Promise<ClientObjectResponse> {
    const args = this.clientArgs(options)

    if (isMashMedia(media)) return this.saveMash(media, args) 
    
    const steps: ClientProgessSteps = {
      step: 0, steps: 2, media, completed: 0
    }
    this.saveMedia(media, steps, args)
    
    const response: ClientObjectResponse = {}
    return Promise.resolve(response)
  }

  private clientArgs(clientOptions: ClientOptions = {}): ClientArgs {
    const { options = {}} = this
    return { ...ClientDefaultArgs, ...options, ...clientOptions }
  }
  
  protected saveMash(mash: MashMedia, args: ClientArgs): Promise<ClientObjectResponse> {
    const temporaryIds = mash.definitionIds.filter(idIsTemporary)
    const temporaryMedia = temporaryIds.map(id => mash.media.fromId(id))

    const steps: ClientProgessSteps = {
      step: 0, steps: 1, mash, media: mash, completed: 0
    }
    
    return this.saveMedias(temporaryMedia, steps, args).then(result => 
      result.error ? result : this.saveMediaRow(mash, steps, args)
    )
  }
    // const definitionsPromise = saveDefinitionsPromise(definitionsUnsaved)
    // const requestPromise = definitionsPromise.then(() => editor.dataPutRequest())
    // const savePromise = requestPromise.then(request => {
    //   // const { editType } = editor
    //   console.debug("DataPutRequest", Endpoints.data[editType].put, JSON.parse(JSON.stringify(request)))
    //   endpointPromise(Endpoints.data[editType].put, request).then((response: DataPutResponse) => {
    //     console.debug("DataPutResponse", Endpoints.data[editType].put, response)
    //     const { error, temporaryIdLookup } = response
    //     if (error) console.error(Endpoints.data[editType].put, error)
    //     else editor.saved(temporaryIdLookup)
    //   })
    // })


  // dataPutRequest(): Promise<DataPutRequest> {
  //   const { mashMedia, editType } = this
  //   assertObject(mashMedia, 'edited')
  //   assertEditType(editType)

  //   // set edit's label if it's empty
  //   const { label } = mashMedia 
  //   if (!isPopulatedString(label)) {
  //     const defaultLabel = Default[editType].label
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


  private errorPromise(code: ErrorName = ErrorName.Internal): Promise<PotentialError> {
    return Promise.resolve(error(code))
  }
  protected saveMediaRow(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    const { id, type } = media
    const options = args[WriteOperation]
    if (!options) return this.errorPromise()

    const { saveRequest } = options
    if (!saveRequest) return this.errorPromise()


    const requestObject: RequestObject = { ...saveRequest }
    requestObject.init ||= {}
    const definition: MediaObject = { id, ...media.toJSON() }
    const request: DataDefinitionPutRequest = { definition }
    requestObject.init.body = request
    return requestJsonPromise(requestObject).then(result => {
      assertIdentified(result)
      const { id, error } = result as DataDefinitionPutResponse
      steps.step++
      const response: ClientObjectResponse = { error, data: media }
      return response
    })
  }

  protected saveAutoDecodings(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))

  }


  
  protected upload(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))
    //   const { uploadResponseIsRequest, uploadCookedTypes } = args

  //   if (uploadResponseIsRequest) {

  //   }

  //   const { label, type, loadedMedia } = media
  //   if (!loadedMedia) return Promise.resolve(error(ErrorName.Internal))
  
  //   if (isRawType(type)) {
  //     type
  //   }
  //   switch (type) {
  //     case AudioType:
  //     case ImageType:
  //     case VideoType:
        
  //       break;
    
  //     default:
  //       break;
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
  protected saveUpload(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    const { id } = media
    if (idIsTemporary(id)) return this.upload(media, steps, args)

    return this.saveMediaRow(media, steps, args)
  }

  protected saveAutoTranscodings(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))

  }

  
  protected saveMedia(media: Media, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    return Promise.resolve(error(ErrorName.ClientDisabledDelete))

    // steps.media = media
    // const { autoDecode, autoTranscode } = args

    // const { id, type, transcodings, decodings } = media
    // return this.saveUpload(media, steps, args).then(result => (
    //   result.error ? result : this.saveAutoDecodings(media, steps, args)
    // ))

    // if (!decodings.length && autoDecode && autoDecode[type])

    // return this.saveMediaRow(media, steps, args)

    
  }


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
        delete target.loadedMedia 
        if (isVideoDefinition(target)) {
          delete target.loadedVideo 
        }
        else if (isUpdatableDurationDefinition(target)) delete target.loadedAudio 
        else if (isImageDefinition(target)) delete target.loadedImage 
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

  protected saveMedias(mediaArray: MediaArray, steps: ClientProgessSteps, args: ClientArgs): Promise<ClientObjectResponse> {
    let promise: Promise<ClientObjectResponse> = Promise.resolve({})
    mediaArray.forEach(media => {
      promise = promise.then(result => (
        result.error ? result : this.saveMedia(media, steps, args)
      ))
    })

    return promise
  }

  decode(args: ClientDecodeOptions): Promise<Decoding> {
    return Promise.resolve({})
  }

  encode(args: ClientEncodeOptions): Promise<Encoding> {
    throw new Error("Method not implemented.")
  }

  transcode(args: ClientTranscodeOptions): Promise<Transcoding> {
    const transcodingobject = { type: VideoType, id: '', request: { endpoint: {}}}
    const transcoding = transcodingInstance(transcodingobject)
    return Promise.resolve(transcoding)

  }
}


// let promise = Promise.resolve()

// definitions.forEach(definition => {
//   assertPreloadableDefinition(definition)
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