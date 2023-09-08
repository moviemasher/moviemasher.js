import { VIDEO } from '@moviemasher/runtime-shared'
import { AudibleAsset, VisibleAsset } from '@moviemasher/runtime-shared'
import { VideoAsset } from "@moviemasher/runtime-shared"
import { Constrained } from '@moviemasher/runtime-shared'

export function VideoAssetMixin
<T extends Constrained<AudibleAsset & VisibleAsset>>(Base: T): 
T & Constrained<VideoAsset> {
  return class extends Base implements VideoAsset {
    type = VIDEO 
  }
}
