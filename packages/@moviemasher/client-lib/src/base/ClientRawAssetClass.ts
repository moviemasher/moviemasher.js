import type { DataOrError, ServerProgress, DecodeOptions, StringDataOrError, TranscodeOptions, TranscodeArgs, JobOptions, DecodeArgs } from '@moviemasher/shared-lib/types.js'
import type { ClientRawAsset, UploadResult } from '../types.js'

import { RawAssetMixin } from '@moviemasher/shared-lib/mixin/raw.js'
import { $AUDIO, $DECODE, $IMAGE, $PROBE, $SVG, $TRANSCODE, $VIDEO, $WAVEFORM, DOT, ERROR, MOVIEMASHER, PROBING_TYPES, arrayRemove, isDecoding, isDefiniteError, isProbing, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isDefined } from '@moviemasher/shared-lib/utility/guard.js'
import { isDropResource, isAudibleAsset, isTranscoding, isRawResource } from '@moviemasher/shared-lib/utility/guards.js'
import { requestUrl } from '@moviemasher/shared-lib/utility/request.js'
import { ClientAssetClass } from './ClientAssetClass.js'
import { EventUpload } from '../utility/events.js'

const MAX_WIDTH = 2000
const MIN_WIDTH = 200

const pixelsFromDuration = (duration: number): number => {
  const width = Math.round(duration * 10)
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width))
}

const WithRawAssetMixin = RawAssetMixin(ClientAssetClass)
export class ClientRawAssetClass extends WithRawAssetMixin implements ClientRawAsset {
  // constructor(...args: any[]) {
  //   const [object] = args as [ClientRawAssetObject]
  //   super(object)
  //   const { request } = object
  //   this.request = request
  // }
  // override get assetObject(): ClientRawAssetObject {
  //   const { resources, request } = this
  //   return { ...super.assetObject, request, resources }
  // }
  // override initializeProperties(object: ClientRawAssetObject): void {

  //   super.initializeProperties(object)
  // }

  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const uploadPromise = this.uploadPromise(progress)
    if (uploadPromise) {
      const uploadOrError = await uploadPromise
      if (isDefiniteError(uploadOrError)) return uploadOrError

      const { data } = uploadOrError
      const { id, assetRequest } = data
      const [resource] = this.resources
      resource.request = assetRequest
      this.saveId(id)
      const decodePromise = this.decodePromise(progress)
      if (decodePromise) {
        const decodeOrError = await decodePromise
        if (isDefiniteError(decodeOrError)) return decodeOrError
      }
      const transcodeOrError = await this.transcodePromise(progress)
      if (isDefiniteError(transcodeOrError)) return transcodeOrError
    }
    return await super.savePromise(progress)
  }

  private decodePromise(progress?: ServerProgress): Promise<StringDataOrError> | undefined {
    const { resource, decodings, type } = this

    if (!isDropResource(resource)) return

    const decoding = decodings.find(decoding => decoding.type === $PROBE)
    if (isProbing(decoding)) {
      // only video that doesn't know its aubible needs to be decoded
      if (type !== $VIDEO) return

      const { data } = decoding
      if (isDefined(data.audible)) return
    }
    const decodingType = $PROBE
    const options: DecodeOptions = { types: PROBING_TYPES }

    const args: DecodeArgs = { resource, type: decodingType, options }
    const promise = MOVIEMASHER.promise($DECODE, args, { progress })
  
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      if (!isDecoding(data)) return namedError(ERROR.Syntax, 'decoding')
      
      if (decoding) this.decodings.splice(this.decodings.indexOf(decoding), 1)
      this.decodings.unshift(data)
      return { data: 'OK' }
    })
  }

  private async transcodePromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const { type, resource } = this

    const result = { data: 'OK' }
    if (!isRawResource(resource)) return result

    const { request } = resource
    const { [$TRANSCODE]: transcodeOptions } = MOVIEMASHER.options
    if (transcodeOptions && transcodeOptions[type]) {
      const types = [...transcodeOptions[type]]
      switch (type) {
        case $VIDEO: {
          delete this._canBeMuted
          if (!this.canBeMuted) {
            // don't make audio or waveform if there is no audio track
            arrayRemove(types, $AUDIO)
            arrayRemove(types, $WAVEFORM)
          }
          break
        }
        case $IMAGE: {
          const url = requestUrl(request)
          if (url.endsWith(`${DOT}${$SVG}`)) {
            // don't make image previews for $SVG files
            arrayRemove(types, $IMAGE)
          }
          break
        }
      }
      for (const transcodingType of types) {
        const options: TranscodeOptions = {}
        if (transcodingType === $WAVEFORM && isAudibleAsset(this)) {
          options.width = pixelsFromDuration(this.duration)
        }

        const transcodeArgs: TranscodeArgs = { resource, type: transcodingType, options }
        const jobOptions: JobOptions = { progress }
        const promise = MOVIEMASHER.promise($TRANSCODE, transcodeArgs, jobOptions)
        const orError = await promise
        if (isDefiniteError(orError)) return orError

        const { data: transcoding } = orError
        if (isTranscoding(transcoding)) this.resources.push(transcoding)
      }
    }
    return result
  }

  override unload(): void {
    super.unload()
    const { request } = this
    if (!request) return

    const { objectUrl, response, mediaPromise, urlPromise } = request
    if (objectUrl) {
      globalThis.window.alert(`ClientRawAssetClass revokeObjectURL ${objectUrl}`)
      URL.revokeObjectURL(objectUrl)
      delete request.objectUrl
    }
    if (response) delete request.response
    if (mediaPromise) delete request.mediaPromise
    if (urlPromise) delete request.urlPromise
  }

  private uploadPromise(progress?: ServerProgress): Promise<DataOrError<UploadResult>> | undefined {
    const { request } = this
    if (!request) return

    const { file, objectUrl } = request
    if (!file) return

    const event = new EventUpload(request, progress)
    MOVIEMASHER.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      if (objectUrl) URL.revokeObjectURL(objectUrl)
      return orError
    })
  }
}
