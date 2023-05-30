import { Property, Rect, Scalar, TypeImage, UnknownRecord } from '@moviemasher/runtime-shared'
import { Constrained } from '../../Base/Constrained.js'
import { Asset, VisibleAsset } from '../Asset/Asset.js'
import { TextAsset, TextAssetObject, TextInstance, TextInstanceObject } from './TextTypes.js'
import { assertPopulatedString, isUndefined } from '../SharedGuards.js'
import { DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { DataTypePercent, DataTypeString } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import type { InstanceArgs, VisibleInstance } from '../Instance/Instance.js'
import { isRect } from '../../Utility/RectFunctions.js'
import { IntrinsicOptions } from '../Mash/Clip/Clip.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { stringFamilySizeRect } from '../../Utility/StringFunctions.js'
import { Default } from '../../Setup/Default.js'
import { TextHeight } from './TextConstants.js'
import { LockHeight } from '../../Setup/EnumConstantsAndFunctions.js'
import { EndpointRequest } from '../../Helpers/Request/Request.js'
import { filterFromId } from '../../Plugin/Filter/FilterFactory.js'
import { Filter } from '../../Plugin/Filter/Filter.js'


export function TextAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    declare request: EndpointRequest

    instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = LockHeight
      return super.instanceArgs(textObject)
    }

    protected _family = ''
    get family(): string { return this._family }
    set family(value: string) { this._family = value }

    initializeProperties(object: TextAssetObject): void {
      const { string, label } = object
     
      this.string = string || label || Default.font.string
  
      this.properties.push(propertyInstance({
        name: 'string', custom: true, type: DataTypeString, defaultValue: this.string
      }))
      this.properties.push(propertyInstance({
        name: 'height', tweenable: true, custom: true, type: DataTypePercent, 
        defaultValue: 0.3, max: 2.0, group: DataGroupSize
      }))
  
      this.properties.push(propertyInstance({
        name: 'width', tweenable: true, custom: true, type: DataTypePercent, 
        defaultValue: 0.8, max: 2.0, group: DataGroupSize
      }))
      super.initializeProperties(object)
    }

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

    intrinsic?: Rect

    intrinsicRect(_ = false): Rect { return this.intrinsic! }


    intrinsicsKnown(options: IntrinsicOptions): boolean { 
      const { size } = options
      if (!size || isRect(this.intrinsic) || this.asset.family) return true
  
      return false
    }


    declare string: string
    
    private _textFilter?: Filter
    get textFilter() { return this._textFilter ||= filterFromId('text')}
  
    toJSON(): UnknownRecord {
      const json = super.toJSON()
      json.intrinsic = this.intrinsicRect(true)
      return json
    }
  
  }
}

