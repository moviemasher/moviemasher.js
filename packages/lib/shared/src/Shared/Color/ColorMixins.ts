import type { Asset, ColorAsset, ColorInstance, ColorInstanceObject, Constrained, Instance, IntrinsicOptions, Rect } from '@moviemasher/runtime-shared'

import { END, RECT_ZERO, CONTENT, IMAGE } from '@moviemasher/runtime-shared'
import { colorGray } from '../../Helpers/Color/ColorConstants.js'
import { DataTypeRgb } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'

export function ColorAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false
  
    container = false
    
    type = IMAGE
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
        targetId: CONTENT, name: 'color', type: DataTypeRgb, 
        defaultValue: colorGray, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: CONTENT, name: `color${END}`, 
        type: DataTypeRgb, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }
    intrinsicRect(_ = false): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}
