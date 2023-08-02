import { Rect, TypeImage, UnknownRecord } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset } from '@moviemasher/runtime-shared'
import { TextAsset, TextAssetObject, TextInstance, TextInstanceObject } from '@moviemasher/runtime-shared'
import { isUndefined } from "@moviemasher/runtime-shared"
import { DataTypePercent, DataTypeString } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import type { InstanceArgs, VisibleInstance } from '@moviemasher/runtime-shared'
import { isRect } from '../../Utility/RectFunctions.js'
import { IntrinsicOptions } from '@moviemasher/runtime-shared'
import { Default } from '../../Setup/Default.js'
import { LockLongest } from '../../Setup/LockConstants.js'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { End } from '../../Base/PropertiedConstants.js'
import { TypeContainer } from '@moviemasher/runtime-client'


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


export function TextInstanceMixin
<T extends Constrained<VisibleInstance>>(Base: T): 
T & Constrained<TextInstance> {
  return class extends Base implements TextInstance {
    constructor(...args: any[]) {
      const [object] = args
      object.lock ||= ''
      super(object)
  
      const { intrinsic } = object as TextInstanceObject
      if (isRect(intrinsic)) this.intrinsic = intrinsic
    }

    declare asset: TextAsset

    hasIntrinsicSizing = true

    override initializeProperties(object: TextInstanceObject): void {
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'string', type: DataTypeString, 
        defaultValue: this.asset.string, 
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'height', type: DataTypePercent, 
        min: 0.0, max: 2.0, step: 0.01, defaultValue: 0.3, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: `height${End}`, 
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
      }))
  
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'width', type: DataTypePercent, 
        min: 0.0, max: 2.0, step: 0.01, tweens: true,
        defaultValue: 0.8, 
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: `width${End}`, 
        min: 0.0, max: 1.0, step: 0.01,
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)

    }

    intrinsic?: Rect

    intrinsicRect(_ = false): Rect { return this.intrinsic! }


    intrinsicsKnown(options: IntrinsicOptions): boolean { 
      const { size } = options
      if (!size || isRect(this.intrinsic) || this.asset.family) return true
  
      return false
    }


    declare string: string
    

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      json.intrinsic = this.intrinsicRect(true)
      return json
    }
  
  }
}

