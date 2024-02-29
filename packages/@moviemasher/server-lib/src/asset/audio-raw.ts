import type { AssetFile, AssetFiles, ServerInstance, AssetFunction, AudioInstance, AudioInstanceObject, CacheArgs } from '@moviemasher/shared-lib/types.js'
import type { ServerAudioAsset } from '../type/ServerAssetTypes.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { $AUDIO, $RAW, ERROR, SLASH, isAssetObject, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerRawAssetClass } from '@moviemasher/shared-lib/base/server-raw-asset.js'
import { ServerInstanceClass } from '@moviemasher/shared-lib/base/server-instance.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/server-audible.js'


interface ServerRawAudioAsset extends ServerAudioAsset {}

interface ServerRawAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerRawAudioAsset
}

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAsset)
export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {
  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible } = args
    if (!audible) return []

    const { request } = this
    if (!request) return []
    
    const { path: file } = request
    assertDefined(file)

    const mutable = this.duration ? this.canBeMuted : true
    if (!mutable) return []
    
    const assetFile: AssetFile = { 
      type: $AUDIO, asset: this, file, avType: $AUDIO 
    }
    return [assetFile]
  }
  
  override instanceFromObject(object?: AudioInstanceObject): ServerRawAudioInstance {
    const args = this.instanceArgs(object)
    return new ServerRawAudioInstanceClass(args)
  }
}

export const serverAudioRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $AUDIO, $RAW)) {
    return namedError(ERROR.Syntax, [$AUDIO, $RAW].join(SLASH))
  }
  return { data: new ServerRawAudioAssetClass(assetObject) }
}


const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class ServerRawAudioInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  declare asset: ServerRawAudioAsset
}
