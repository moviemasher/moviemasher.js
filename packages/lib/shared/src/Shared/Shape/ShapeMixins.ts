import type { VisibleInstance } from '@moviemasher/runtime-shared'
import type { Rect, IntrinsicOptions, Size,  UnknownRecord } from '@moviemasher/runtime-shared'
import type { Constrained } from '@moviemasher/runtime-shared'
import type { VisibleAsset } from '@moviemasher/runtime-shared'
import type { ShapeAsset, ShapeAssetObject, ShapeInstance } from '@moviemasher/runtime-shared'

import { TypeImage } from '@moviemasher/runtime-shared'
import { PointZero } from '../../Utility/PointConstants.js'
import { isAboveZero } from '../SharedGuards.js'
import { DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { sizeSvgD } from '../../Utility/SizeFunctions.js'

export function ShapeAssetMixin
<T extends Constrained<VisibleAsset>>(Base: T): 
T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
    initializeProperties(object: ShapeAssetObject) {
      const { path, pathHeight, pathWidth } = object as ShapeAssetObject
      
      this.pathWidth = isAboveZero(pathWidth) ? pathWidth : 100
     
      this.pathHeight = isAboveZero(pathHeight) ? pathHeight : 100
      
      this.path = path || sizeSvgD(this.pathSize)

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
    
    canBeContent = false
  
    content = false
    
    isVector = true

    declare path: string 

    declare pathHeight: number

    declare pathWidth: number
      
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

    intrinsicRect(_editing = false): Rect {
      const { pathHeight: height, pathWidth: width} = this.asset
      console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...PointZero }
    }
  
    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}

