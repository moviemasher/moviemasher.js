import { TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '../../Base/Constrained.js'
import { VisibleAsset } from '../Asset/Asset.js'
import { ImageAsset } from './ImageAsset.js'

export function ImageAssetMixin
<T extends Constrained<VisibleAsset>>(Base: T): 
T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {

   
    type = TypeImage 
  }
}