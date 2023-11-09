import type { ClientRawAsset, ClientRawAssetObject, ClientMediaRequest, ServerProgress, UploadResult } from '@moviemasher/runtime-client'
import type { DataOrError, DecodeOptions, Size, StringDataOrError, Transcoding, TranscodingTypes, Transcodings } from '@moviemasher/runtime-shared'

import { KindsProbe, assertAudibleAsset } from '@moviemasher/lib-shared'
import { EventClientDecode, EventClientTranscode, EventUpload, MovieMasher } from '@moviemasher/runtime-client'
import { AUDIO, PROBE, SEQUENCE, VIDEO, isDefiniteError, isProbing, isUndefined } from '@moviemasher/runtime-shared'
import { ClientAssetClass } from '../ClientAssetClass.js'

export class ClientRawAssetClass extends ClientAssetClass implements ClientRawAsset {
  constructor(...args: any[]) {
    const [object] = args as [ClientRawAssetObject]
    super(object)

    const { request } = object
    this.request = request
  }

  override get assetObject(): ClientRawAssetObject {
    const { request, transcodings } = this
    return { ...super.assetObject, request, transcodings }
  }

  override assetIcon(_: Size): Promise<SVGSVGElement> | undefined { return }

  override initializeProperties(object: ClientRawAssetObject): void {
    const { transcodings } = object
    if (transcodings) this.transcodings.push(...transcodings)
    super.initializeProperties(object)
  }


  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return
  }
  
  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const uploadPromise = this.uploadPromise(progress)
    if (uploadPromise) {
      const uploadOrError = await uploadPromise
      if (isDefiniteError(uploadOrError)) {
        // console.error(this.constructor.name, 'ClientRawAssetClass savePromise', uploadOrError)
        return uploadOrError
      }
      
      const { data } = uploadOrError
      
      const { id, assetRequest } = data
      this.request = assetRequest
      // console.log(this.constructor.name, 'ClientRawAssetClass savePromise calling saveId', uploadOrError.data)

      this.saveId(id)


      const decodePromise = this.decodePromise(progress)
      if (decodePromise) {
        const decodeOrError = await decodePromise
        if (isDefiniteError(decodeOrError)) return decodeOrError
      }

      const transcodePromise = this.transcodePromise(progress)
      if (transcodePromise) {
        const transcodeOrError = await transcodePromise
        if (isDefiniteError(transcodeOrError)) return transcodeOrError
      }
    }
    return await super.savePromise(progress)
  }

  private decodePromise(progress?: ServerProgress): Promise<StringDataOrError> | undefined {
    const decoding = this.decodings.find(decoding => decoding.type === PROBE)
    if (isProbing(decoding)) {
      // only video that doesn't know its aubible needs to be decoded
      if (this.type !== VIDEO) return
      
      const { data } = decoding
      if (!isUndefined(data.audio)) return
    }
    const decodingType = PROBE
    const options: DecodeOptions = { types: KindsProbe }
    const event = new EventClientDecode(this, decodingType, options, progress)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      if (decoding) this.decodings.splice(this.decodings.indexOf(decoding), 1)
      this.decodings.unshift(data)
      return { data: 'OK' }
    })
  }

  private async transcodePromise(progress?: ServerProgress): Promise<Promise<StringDataOrError> | undefined> {
    const { type } = this
    const transcodingTypes: TranscodingTypes = []
    switch (type) {
      case VIDEO: {
        assertAudibleAsset(this)
        
        transcodingTypes.push(SEQUENCE)
        if (this.audio) transcodingTypes.push(AUDIO)
        break
      }
      default: transcodingTypes.push(type)
    }
    for (const transcodingType of transcodingTypes) {
      const event = new EventClientTranscode(this, transcodingType, {}, progress)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) continue

      const orError = await promise
      // console.log('ClientRawAssetClass.transcodePromise', { orError })
      
      if (isDefiniteError(orError)) return orError

      const { data: transcoding } = orError
      // console.log('ClientRawAssetClass.transcodePromise', { transcoding })
      this.transcodings.push(transcoding)
    }
    return { data: 'OK' }
  }
  
  private uploadPromise(progress?: ServerProgress): Promise<DataOrError<UploadResult>> | undefined {
    const { request } = this
    const { file, objectUrl } = request
    if (!file) return
    
    const event = new EventUpload(request, progress)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError 

      if (objectUrl) URL.revokeObjectURL(objectUrl)
      return orError
    })
  }

  request: ClientMediaRequest


  transcodings: Transcodings = []
}
