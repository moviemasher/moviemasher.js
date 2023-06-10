import { TypeVideo } from '@moviemasher/runtime-shared'
import { AudibleAsset, VisibleAsset } from '../Asset/AssetTypes.js'
import { VideoAsset } from "./VideoAsset.js"
import { Constrained } from '@moviemasher/runtime-shared'

export function VideoAssetMixin
<T extends Constrained<AudibleAsset & VisibleAsset>>(Base: T): 
T & Constrained<VideoAsset> {
  return class extends Base implements VideoAsset {
    type = TypeVideo 
  }
}
