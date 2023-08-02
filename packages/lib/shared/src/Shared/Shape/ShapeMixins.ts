import type { ShapeInstanceObject, VisibleInstance } from '@moviemasher/runtime-shared'
import type { Rect, IntrinsicOptions, Size,  UnknownRecord } from '@moviemasher/runtime-shared'
import type { Constrained } from '@moviemasher/runtime-shared'
import type { VisibleAsset } from '@moviemasher/runtime-shared'
import type { ShapeAsset, ShapeAssetObject, ShapeInstance } from '@moviemasher/runtime-shared'

import { TypeImage } from '@moviemasher/runtime-shared'
import { POINT_ZERO } from '../../Utility/PointConstants.js'
import { isAboveZero } from '../SharedGuards.js'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { sizeSvgD } from '../../Utility/SizeFunctions.js'
import { End } from '../../Base/PropertiedConstants.js'
import { TypeContainer } from '@moviemasher/runtime-client'

export function ShapeAssetMixin
<T extends Constrained<VisibleAsset>>(Base: T): 
T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
   
    
    canBeContent = false
  
    content = false
    
    override initializeProperties(object: ShapeAssetObject) {
      const { path, pathHeight, pathWidth } = object as ShapeAssetObject
      this.pathWidth = isAboveZero(pathWidth) ? pathWidth : 100
      this.pathHeight = isAboveZero(pathHeight) ? pathHeight : 100
      this.path = path || sizeSvgD(this.pathSize)
      super.initializeProperties(object)
    }
    
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

    override initializeProperties(object: ShapeInstanceObject) {
      this.properties.push(propertyInstance({
        targetId: TypeContainer, name: 'width', type: DataTypePercent, 
        min: 0.0, max: 2.0, step: 0.01,
        defaultValue: 1.0, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer,name: `width${End}`, 
        type: DataTypePercent, min: 0.0, max: 2.0, step: 0.01, 
        undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer,name: 'height', type: DataTypePercent, 
        min: 0.0, max: 2.0, step: 0.01,tweens: true,
        defaultValue: 1.0, 
      }))
      this.properties.push(propertyInstance({
        targetId: TypeContainer,name: `height${End}`, 
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 2.0, step: 0.01,
      }))
      super.initializeProperties(object)
    }
    intrinsicRect(_editing = false): Rect {
      const { pathHeight: height, pathWidth: width} = this.asset
      // console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...POINT_ZERO }
    }
  
    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}

