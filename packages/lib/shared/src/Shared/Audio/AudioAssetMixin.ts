import { TypeAudio } from "@moviemasher/runtime-shared"
import { Constrained } from "@moviemasher/runtime-shared"
import { AudibleAsset } from "@moviemasher/runtime-shared"
import { AudioAsset } from "@moviemasher/runtime-shared"

export function AudioAssetMixin
<T extends Constrained<AudibleAsset>>(Base: T): 
T & Constrained<AudioAsset> {
  return class extends Base implements AudioAsset {
    type = TypeAudio 
  }
}