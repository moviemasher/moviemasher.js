import type { ClientAudio, ClientRawAudioAsset, ClientRawAudioAssetObject, ClientRawAudioInstance } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AudioInstance, AudioInstanceArgs, AudioInstanceObject, DataOrError, InstanceArgs } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, AudibleInstanceMixin, AudioAssetMixin, AudioInstanceMixin, } from '@moviemasher/lib-shared'
import { EventAsset, EventClientAudioPromise, MovieMasher } from '@moviemasher/runtime-client'
import { RAW, AUDIO, errorThrow, isAssetObject, isDefiniteError } from '@moviemasher/runtime-shared'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAudibleInstanceMixin } from '../Audible'
import { ClientAudibleAssetMixin } from '../Audible/ClientAudibleAssetMixin.js'
import { ClientRawAssetClass } from './ClientRawAssetClass.js'

const WithAsset = AudibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientAudibleAssetMixin(WithAsset)
const WithAudioAsset = AudioAssetMixin(WithClientAsset)
export class ClientRawAudioAssetClass extends WithAudioAsset implements ClientRawAudioAsset {
  constructor(args: ClientRawAudioAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { audible } = args
    if (!audible) return Promise.resolve({ data: 0 })

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve({ data: 0 })

    const transcoding = this.preferredTranscoding(AUDIO) || this
    if (!transcoding) {
      return Promise.resolve({ data: 0 })
    }

    const { request } = transcoding
    const event = new EventClientAudioPromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
      return { data: 1 }
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

  static handleAsset(event: EventAsset): void {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, AUDIO, RAW)) {
      detail.asset = new ClientRawAudioAssetClass(assetObject)
      event.stopImmediatePropagation()
    }  
  }
}

// listen for audio/raw asset event
export const ClientRawAudioListeners = () => ({
  [EventAsset.Type]: ClientRawAudioAssetClass.handleAsset
})

const WithInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithClientInstance)

export class ClientRawAudioInstanceClass extends WithAudioInstance implements ClientRawAudioInstance {
  constructor(args: AudioInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawAudioAsset
}
