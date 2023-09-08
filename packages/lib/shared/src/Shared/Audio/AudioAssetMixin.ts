import type { AudibleAsset, AudioAsset, Constrained } from '@moviemasher/runtime-shared'

import { AUDIO } from '@moviemasher/runtime-shared'

export function AudioAssetMixin
<T extends Constrained<AudibleAsset>>(Base: T): 
T & Constrained<AudioAsset> {
  return class extends Base implements AudioAsset {
    canBeContainer = false
  
    type = AUDIO 
  }
}