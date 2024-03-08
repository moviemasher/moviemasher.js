import type { ClientAsset, DataOrError, DecodeArgs, DecodeOptions, JobOptions, RequestArgs, ServerProgress, StringDataOrError, TranscodeArgs, TranscodeOptions, UploadResult } from '../types.js'

import { $AUDIO, $DECODE, $FILE, $IMAGE, $PROBE, $SVG, $TRANSCODE, $UPLOAD, $VIDEO, $WAVEFORM, DOT, ERROR, MOVIE_MASHER, PROBING_TYPES, arrayRemove, isDecoding, isDefiniteError, isProbing, namedError } from '../runtime.js'
import { isDefined } from '../utility/guard.js'
import { isAudibleAsset, isDropResource, isRawResource, isTranscoding } from '../utility/guards.js'
import { requestUrl } from '../utility/request.js'
import { ClientAssetClass } from './client-asset.js'

const MAX_WIDTH = 2000
const MIN_WIDTH = 200

const pixelsFromDuration = (duration: number): number => {
  const width = Math.round(duration * 10)
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width))
}

export class ClientRawAssetClass extends ClientAssetClass implements ClientAsset {
  private decodePromise(progress?: ServerProgress): Promise<StringDataOrError> | undefined {
    const { resource, decodings, type } = this

    if (!isDropResource(resource)) return

    const decoding = decodings.find(decoding => decoding.type === $PROBE)
    if (isProbing(decoding)) {
      // only audio and video that doesn't know its aubible needs to be decoded
      if (type === $IMAGE) return

      if (isDefined(decoding.data.raw)) return
    }
    const decodingType = $PROBE
    const options: DecodeOptions = { types: PROBING_TYPES }

    const args: DecodeArgs = { resource, type: decodingType, options }
    const promise = MOVIE_MASHER.promise(args, $DECODE, { progress })
  
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      if (!isDecoding(data)) return namedError(ERROR.Syntax, 'decoding')
      
      if (decoding) decodings.splice(decodings.indexOf(decoding), 1)
      decodings.unshift(data)
      return { data: 'OK' }
    })
  }

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

  private async transcodePromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const { type, resource } = this

    const result = { data: 'OK' }
    if (!isRawResource(resource)) return result

    const { request } = resource
    const { [$TRANSCODE]: transcodeOptions } = MOVIE_MASHER.options
    if (transcodeOptions && transcodeOptions[type]) {
      const types = [...transcodeOptions[type]]
      switch (type) {
        case $VIDEO: {
          if (isAudibleAsset(this)) {
            console.log(this.constructor.name, 'transcodePromise resetting canBeMuted')
            this.canBeMuted = undefined           
            console.log(this.constructor.name, 'transcodePromise canBeMuted now', this.canBeMuted)

            if (!this.canBeMuted) {
              // don't make audio or waveform if there is no audio track
              arrayRemove(types, $AUDIO)
              arrayRemove(types, $WAVEFORM)
            }
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
        const promise = MOVIE_MASHER.promise(transcodeArgs, $TRANSCODE, jobOptions)
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
      // globalThis.window.alert(`ClientRawAssetClass revokeObjectURL ${objectUrl}`)
      URL.revokeObjectURL(objectUrl)
      delete request.objectUrl
    }
    if (response) delete request.response
    if (mediaPromise) delete request.mediaPromise
    if (urlPromise) delete request.urlPromise
  }

  private uploadPromise(progress?: ServerProgress): Promise<DataOrError<UploadResult>> | undefined {
    const { request } = this
    if (!request?.file) return

    const requestArgs: RequestArgs = { request, type: $UPLOAD }
    const promise = MOVIE_MASHER.promise(requestArgs, $FILE, { progress })
    if (!promise) return

    const { objectUrl } = request
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      if (objectUrl) {
        delete request.objectUrl
        URL.revokeObjectURL(objectUrl)
      }
      delete request.file
      return orError
    })
  }
}
