import type { 
  AssetEventDetail, AssetCacheArgs, AudioInstance, AudioInstanceArgs, 
  AudioInstanceObject
} from '@moviemasher/runtime-shared'
import type { 
  ClientAudio, 
  ClientRawAudioAsset, ClientRawAudioAssetObject, ClientRawAudioInstance, 
} from '@moviemasher/lib-shared'

import { 
  errorThrow, isAssetObject, SourceRaw, TypeAudio 
} from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { 
  AudibleAssetMixin, ClientAudibleAssetMixin, 
  ClientAudibleInstanceMixin, AudibleInstanceMixin, AudioAssetMixin, 
  AudioInstanceMixin, ClientInstanceClass, ClientRawAssetClass, 
  clientMediaAudioPromise, isDefiniteError 
} from '@moviemasher/lib-shared'

const WithAsset = AudibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientAudibleAssetMixin(WithAsset)
const WithAudioAsset = AudioAssetMixin(WithClientAsset)

export class ClientRawAudioAssetClass extends WithAudioAsset implements ClientRawAudioAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { audible } = args
    if (!audible) return Promise.resolve()

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve()

    const transcoding = this.preferredAsset(TypeAudio) 
    if (!transcoding) return Promise.resolve()

    const { request } = transcoding
    return clientMediaAudioPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
      return 
    })
  }

  override initializeProperties(object: ClientRawAudioAssetObject): void {
    const { loadedAudio } = object
    if (loadedAudio) this.loadedAudio = loadedAudio

    super.initializeProperties(object)
  }

  override instanceFromObject(object?: AudioInstanceObject | undefined): AudioInstance {
    return new ClientRawAudioInstanceClass(this.instanceArgs(object))
  }

  override instanceArgs(object: AudioInstanceObject = {}): AudioInstanceArgs {
    const args = super.instanceArgs(object)
    return { ...args, asset: this }
  }

  override loadedAudio?: ClientAudio

  get requestPromise(): Promise<void> { return Promise.resolve() }
}

const WithInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithClientInstance)

export class ClientRawAudioInstanceClass extends WithAudioInstance implements ClientRawAudioInstance {
  declare asset: ClientRawAudioAsset
}

// listen for audio/raw asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeAudio, SourceRaw)) {
    detail.asset = new ClientRawAudioAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
