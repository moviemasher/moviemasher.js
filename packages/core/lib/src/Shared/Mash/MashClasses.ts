import type { InstanceArgs, InstanceObject } from '../Instance/Instance.js'
import type { MashAsset, MashInstance } from './MashTypes.js'

import { AssetClass } from '../Asset/AssetClass.js'
import { InstanceClass } from '../Instance/InstanceClass.js'
import { MashAssetMixin, MashInstanceMixin } from './MashMixins.js'


const WithMashAsset = MashAssetMixin(AssetClass)

export class MashAssetClass extends WithMashAsset implements MashAsset {

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}

const WithMashInstance = MashInstanceMixin(InstanceClass)

export class MashInstanceClass extends WithMashInstance implements MashInstance {
  
}