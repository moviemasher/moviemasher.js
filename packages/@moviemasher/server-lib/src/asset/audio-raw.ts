import type { AudioInstanceObject, CacheArgs, InstanceArgs, ListenersFunction, RawAudioAssetObject } from '@moviemasher/shared-lib/types.js'
import type { ServerRawAudioAsset, ServerRawAudioInstance } from '../type/ServerTypes.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { AUDIO, RAW, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { EventServerAsset } from '../runtime.js'
import { AssetFile, AssetFiles } from '../types.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAsset)
export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {
  constructor(args: RawAudioAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible } = args
    if (!audible) return []

    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)

    const mutable = this.duration ? this.canBeMuted : true
    if (!mutable || this.muted) return []
    
    const assetFile: AssetFile = { 
      type: AUDIO, asset: this, file, avType: AUDIO 
    }
    return [assetFile]
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
