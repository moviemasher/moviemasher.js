import type { Asset, Constrained, EndpointRequest, InstanceArgs } from '@moviemasher/runtime-shared'

import { TextAsset, TextAssetObject, TextInstanceObject, IMAGE, isUndefined } from '@moviemasher/runtime-shared'
import { Default } from '../../Setup/Default.js'
import { AspectMaintain, LockWidth } from '../../Setup/LockConstants.js'

export function TextAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    declare request: EndpointRequest

    instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = LockWidth
      if (isUndefined(textObject.sizeAspect)) textObject.sizeAspect = AspectMaintain
      if (isUndefined(textObject.pointAspect)) textObject.pointAspect = AspectMaintain
      return super.instanceArgs(textObject)
    }

    protected _family = ''
    get family(): string { return this._family }
    set family(value: string) { this._family = value }

    override initializeProperties(object: TextAssetObject): void {
      const { string, label } = object
     
      this.string = string || label || Default.font.string
  
      super.initializeProperties(object)
    }
    
    canBeContent = false
  
    declare string: string

    isVector = true

    type = IMAGE
  }
}


