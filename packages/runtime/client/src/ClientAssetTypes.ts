
import type { VisibleAsset, AudibleAsset, RawAssetObject, Size } from '@moviemasher/runtime-shared'

import type { ClientAsset } from './ClientAsset.js'
import type { ClientAudioNode, ClientAudio, ClientImage, ClientVideo, ClientMediaRequest } from './ClientMedia.js'
import { TranscodingObjects } from '@moviemasher/runtime-shared'

export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  audibleSource(): ClientAudioNode | undefined
  loadedAudio?: ClientAudio
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {
  previewSize?: Size
}
/* 

  override get previewSize(): Size | undefined {
    const transcoding = this.transcodings.find(transcoding => {
      return transcoding.request.response
    })
    // console.log(this.constructor.name, 'previewSize transcoding', transcoding)
    if (!transcoding) return this.sourceSize

    const { response: response } = transcoding.request
    if (sizeAboveZero(response)) {
      const { width, height } = response
      if (isAboveZero(width) && isAboveZero(height)) return { width, height }
    }
    return undefined
  }
*/


export interface ClientRawAssetObject extends ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject {
  request: ClientMediaRequest
  transcodings?: TranscodingObjects

}

export interface ClientRawAudioAssetObject extends RawAssetObject {
  loadedAudio?: ClientAudio
}

export interface ClientRawImageAssetObject extends RawAssetObject {
  loadedImage?: ClientImage
}

export interface ClientRawVideoAssetObject extends RawAssetObject {
  loadedVideo?: ClientVideo
}
