import type { Size,  UnknownRecord } from '@moviemasher/runtime-shared'
import type { Constrained } from '@moviemasher/runtime-shared'
import type { VisibleAsset } from '@moviemasher/runtime-shared'
import type { ShapeAsset, ShapeAssetObject } from '@moviemasher/runtime-shared'

import { TypeImage } from '@moviemasher/runtime-shared'
import { isAboveZero } from '../SharedGuards.js'
import { sizeSvgD } from '../../Utility/SizeFunctions.js'

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


