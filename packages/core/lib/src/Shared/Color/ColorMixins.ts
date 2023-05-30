import { TypeImage } from '@moviemasher/runtime-shared'
import { Constrained } from '../../Base/Constrained.js'
import { Asset } from '../Asset/Asset.js'
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

export function ColorAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {


    color = colorGray

    initializeProperties(object: ColorAssetObject): void {
      const { color } = object 
      if (isPopulatedString(color) && colorValidServer(color)) this.color = color
      this.properties.push(propertyInstance({
        tweenable: true, name: 'color', type: DataTypeRgb, 
        defaultValue: this.color, group: DataGroupColor
      }))
      
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
  
  }
}
