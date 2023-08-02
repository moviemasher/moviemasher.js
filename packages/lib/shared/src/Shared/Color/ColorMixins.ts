import { IntrinsicOptions, Rect, TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset } from '@moviemasher/runtime-shared'
import { ColorAsset, ColorInstance } from '@moviemasher/runtime-shared'
import type { ColorInstanceObject, Instance } from '@moviemasher/runtime-shared'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { DataTypeRgb } from '../../Setup/DataTypeConstants.js'
import { colorGray } from '../../Helpers/Color/ColorConstants.js'
import { RECT_ZERO } from '../../Utility/RectConstants.js'
import { End } from '../../Base/PropertiedConstants.js'
import { TypeContent } from '@moviemasher/runtime-client'

export function ColorAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false
  
    container = false
    
    type = TypeImage
  }
}

export function ColorInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<ColorInstance> {
  return class extends Base implements ColorInstance {
    declare asset: ColorAsset

    declare color: string

    override initializeProperties(object: ColorInstanceObject): void {
      this.properties.push(propertyInstance({
        targetId: TypeContent, name: 'color', type: DataTypeRgb, 
        defaultValue: colorGray, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContent, name: `color${End}`, 
        type: DataTypeRgb, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }
    intrinsicRect(_ = false): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}
