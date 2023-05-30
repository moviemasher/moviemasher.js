import { Size, TypeImage, UnknownRecord } from '@moviemasher/runtime-shared'
import { Constrained } from '../../Base/Constrained.js'
import { VisibleAsset } from '../Asset/Asset.js'
import { ShapeAsset, ShapeAssetObject, ShapeInstance } from './ShapeTypes.js'
import { assertObject, isAboveZero } from '../SharedGuards.js'
import { DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { svgDFromSize } from '../../Helpers/Svg/SvgFunctions.js'
import type { VisibleInstance } from '../Instance/Instance.js'

export function ShapeAssetMixin
<T extends Constrained<VisibleAsset>>(Base: T): 
T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
    constructor(...args: any[]) {
      const [object] = args
      assertObject(object, 'ShapeAssetMixin')
      super(object)
      const { path, pathHeight, pathWidth } = object as ShapeAssetObject
      if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
      if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
      this.path = path || svgDFromSize(this.pathSize)
    }

    initializeProperties(object: ShapeAssetObject) {
      // console.log(this.constructor.name, 'initializeProperties', object)
      this.properties.push(propertyInstance({
        name: 'width', tweenable: true, type: DataTypePercent, 
        group: DataGroupSize, defaultValue: 1.0, max: 2.0
      }))
      this.properties.push(propertyInstance({
        name: 'height', tweenable: true, type: DataTypePercent, 
        group: DataGroupSize, defaultValue: 1.0, max: 2.0
      }))
      super.initializeProperties(object)
    }
    
    isVector = true

    path: string 

    pathHeight = 100

    pathWidth = 100
      
    get pathSize(): Size {
      return { width: this.pathWidth, height: this.pathHeight }
    }
      
    toJSON(): UnknownRecord {
      const object = super.toJSON()
      if (this.path) object.path = this.path
      if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
      if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
      return object
    }

    type = TypeImage
  }
}


export function ShapeInstanceMixin
<T extends Constrained<VisibleInstance>>(Base: T): 
T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {

    declare asset: ShapeAsset

    hasIntrinsicSizing = true
  }
}

