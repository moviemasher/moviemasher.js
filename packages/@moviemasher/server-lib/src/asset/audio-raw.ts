import type { AudioInstanceObject, CacheArgs, InstanceArgs, ListenersFunction, RawAudioAssetObject } from '@moviemasher/shared-lib/types.js'
import type { ServerRawAudioAsset, ServerRawAudioInstance } from '../type/ServerTypes.js'
import type { AssetFile, AssetFiles, ServerAssetManager } from '../types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { $AUDIO, $RAW, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { EventServerAsset } from '../utility/events.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAsset)
export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {
  constructor(args: RawAudioAssetObject, manager?: ServerAssetManager) {
    super(args, manager)
    this.initializeProperties(args)
  }

  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible } = args
    if (!audible) return []

    const { request } = this
    if (!request) return []
    
    const { path: file } = request
    assertDefined(file)

    const mutable = this.duration ? this.canBeMuted : true
    if (!mutable || this.muted) return []
    
    const assetFile: AssetFile = { 
      type: $AUDIO, asset: this, file, avType: $AUDIO 
    }
    return [assetFile]
  }
  
  override instanceFromObject(object?: AudioInstanceObject): ServerRawAudioInstance {
    const args = this.instanceArgs(object)
    return new ServerRawAudioInstanceClass(args)
  }

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject, manager } = detail
    if (isAssetObject(assetObject, $AUDIO, $RAW)) {
      detail.asset = new ServerRawAudioAssetClass(assetObject, manager)
      event.stopImmediatePropagation()
    } 
  }
}

const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class ServerRawAudioInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  constructor(args: AudioInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerRawAudioAsset
}

// listen for audio/raw asset event
export const ServerRawAudioListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerRawAudioAssetClass.handleAsset
})
