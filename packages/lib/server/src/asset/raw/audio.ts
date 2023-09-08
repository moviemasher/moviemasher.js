import type { AudioInstanceObject, InstanceArgs, RawAudioAssetObject } from '@moviemasher/runtime-shared'
import type { ServerRawAudioAsset, ServerRawAudioInstance } from '../../Types/ServerRawTypes.js'

import { AudibleAssetMixin, AudibleInstanceMixin, AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/lib-shared'
import { EventServerAsset, MovieMasher } from '@moviemasher/runtime-server'
import { SourceRaw, AUDIO, isAssetObject } from '@moviemasher/runtime-shared'
import { ServerAudibleAssetMixin } from '../../Base/ServerAudibleAssetMixin.js'
import { ServerAudibleInstanceMixin } from '../../Base/ServerAudibleInstanceMixin.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAudibleAsset)

export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {
  constructor(args: RawAudioAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override instanceFromObject(object?: AudioInstanceObject): ServerRawAudioInstance {
    const args = this.instanceArgs(object)
    return new ServerRawAudioInstanceClass(args)
  }

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, AUDIO, SourceRaw)) {
      detail.asset = new ServerRawAudioAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for audio/raw asset event
export const ServerRawAudioListeners = () => ({
  [EventServerAsset.Type]: ServerRawAudioAssetClass.handleAsset
})

const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class ServerRawAudioInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  declare asset: ServerRawAudioAsset
  
  constructor(args: AudioInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
}
