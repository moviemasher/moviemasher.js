import { TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset } from '@moviemasher/runtime-shared'
import { TextAsset, TextAssetObject, TextInstanceObject } from '@moviemasher/runtime-shared'
import { isUndefined } from "@moviemasher/runtime-shared"
import type { InstanceArgs } from '@moviemasher/runtime-shared'
import { Default } from '../../Setup/Default.js'
import { LockLongest } from '../../Setup/LockConstants.js'
import { EndpointRequest } from '@moviemasher/runtime-shared'


export function TextAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    declare request: EndpointRequest

    instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = LockLongest
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

    type = TypeImage
  }
}


