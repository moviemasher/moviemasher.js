import { Rect, TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset } from '../Asset/AssetTypes.js'
import { ColorAsset, ColorAssetObject, ColorInstance, ColorInstanceObject } from './ColorTypes.js'
import type { Instance } from '../Instance/Instance.js'
import { filterFromId } from '../../Plugin/Filter/FilterFactory.js'
import { Filter } from '../../Plugin/Filter/Filter.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { colorValidServer } from '../../Helpers/Color/ColorFunctions.js'
import { isPopulatedString } from '../SharedGuards.js'
import { DataTypeRgb } from '../../Setup/DataTypeConstants.js'
import { DataGroupColor } from '../../Setup/DataGroupConstants.js'
import { colorGray } from '../../Helpers/Color/ColorConstants.js'
import { RectZero } from '../../Utility/RectConstants.js'
import { IntrinsicOptions } from '../index.js'

export function ColorAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    color = colorGray

    container = false
    
    initializeProperties(object: ColorAssetObject): void {
      const { color } = object 
      if (isPopulatedString(color) && colorValidServer(color)) this.color = color
      this.properties.push(propertyInstance({
        tweenable: true, name: 'color', type: DataTypeRgb, 
        defaultValue: this.color, group: DataGroupColor
      }))
      super.initializeProperties(object)
    }
    
    type = TypeImage

  }
}

export function ColorInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<ColorInstance> {
  return class extends Base implements ColorInstance {
    declare color: string
    declare asset: ColorAsset
    private _colorFilter?: Filter
    get colorFilter() { return this._colorFilter ||= filterFromId('color')}

    intrinsicRect(_ = false): Rect { return RectZero }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}
