import { IntrinsicOptions, Rect, TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset } from '@moviemasher/runtime-shared'
import { ColorAsset, ColorAssetObject, ColorInstance } from '@moviemasher/runtime-shared'
import type { Instance } from '@moviemasher/runtime-shared'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { colorValidServer } from '../../Helpers/Color/ColorFunctions.js'
import { isPopulatedString } from "@moviemasher/runtime-shared"
import { DataTypeRgb } from '../../Setup/DataTypeConstants.js'
import { DataGroupColor } from '../../Setup/DataGroupConstants.js'
import { colorGray } from '../../Helpers/Color/ColorConstants.js'
import { RectZero } from '../../Utility/RectConstants.js'

export function ColorAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    color = colorGray

    canBeContainer = false
  
    container = false
    
    initializeProperties(object: ColorAssetObject): void {
      // const { color } = object 
      // if (isPopulatedString(color) && colorValidServer(color)) this.color = color
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

    intrinsicRect(_ = false): Rect { return RectZero }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}
