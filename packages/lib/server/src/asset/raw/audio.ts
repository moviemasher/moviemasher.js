import type { AudioInstanceObject, InstanceArgs, ListenersFunction, RawAudioAssetObject } from '@moviemasher/runtime-shared'
import type { ServerRawAudioAsset, ServerRawAudioInstance } from '../../Types/ServerRawTypes.js'

import { AudibleAssetMixin, AudioAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { AudibleInstanceMixin, AudioInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { EventServerAsset } from '@moviemasher/runtime-server'
import { AUDIO, RAW, isAssetObject } from '@moviemasher/runtime-shared'
import { ServerAudibleAssetMixin } from '../../Base/ServerAudibleAssetMixin.js'
import { ServerAudibleInstanceMixin } from '../../Base/ServerAudibleInstanceMixin.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'

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
    if (isAssetObject(assetObject, AUDIO, RAW)) {
      detail.asset = new ServerRawAudioAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for audio/raw asset event
export const ServerRawAudioListeners: ListenersFunction = () => ({
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
