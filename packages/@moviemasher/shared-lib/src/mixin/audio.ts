import type { AudibleAsset, AudibleInstance, AudioAsset, AudioInstance, Constrained } from '../types.js'

import { AUDIO } from '../runtime.js'

export function AudioInstanceMixin<T extends Constrained<AudibleInstance>>(Base: T):
  T & Constrained<AudioInstance> {
  return class extends Base implements AudioInstance {
    declare asset: AudioAsset
  }
}
export function AudioAssetMixin<T extends Constrained<AudibleAsset>>(Base: T):
  T & Constrained<AudioAsset> {
  return class extends Base implements AudioAsset {

    type = AUDIO
  }
}



