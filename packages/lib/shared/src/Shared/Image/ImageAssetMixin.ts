import { TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleAsset } from '@moviemasher/runtime-shared'
import { ImageAsset } from '@moviemasher/runtime-shared'

export function ImageAssetMixin
<T extends Constrained<VisibleAsset>>(Base: T): 
T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {
    type = TypeImage 
  }
}