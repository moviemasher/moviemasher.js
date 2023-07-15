import type { ContentRectArgs } from '@moviemasher/runtime-shared'
import type {IntrinsicOptions} from '@moviemasher/runtime-shared'
import type {Rect} from '@moviemasher/runtime-shared'
import type {Time} from '@moviemasher/runtime-shared'

import { assertSizeAboveZero, sizeAboveZero } from '../../Utility/SizeFunctions.js'
import { DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { rectFromSize } from '../../Utility/RectFunctions.js'
import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleAsset } from '@moviemasher/runtime-shared'
import { Instance, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'

export function VisibleInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    colorMaximize = true

    declare asset: VisibleAsset

    hasIntrinsicSizing = true

    initializeProperties(object: VisibleInstanceObject): void {
      const { container } = object 
      const hasDimensions = container || !this.isDefault
      if (hasDimensions) {
        const min = container ? 0.0 : 1.0
        this.addProperties(object, propertyInstance({
          tweenable: true, name: 'width', type: DataTypePercent, 
          group: DataGroupSize, defaultValue: 1.0, max: 2.0, min
        }))
        this.addProperties(object, propertyInstance({
          tweenable: true, name: 'height', type: DataTypePercent, 
          group: DataGroupSize, defaultValue: 1.0, max: 2.0, min
        }))
      }
      super.initializeProperties(object)
    }

    intrinsicRect(editing = false): Rect {
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: size } = this.asset
      assertSizeAboveZero(size, key)
      const rect = { ...PointZero, ...size } 
      // console.log(this.constructor.name, 'intrinsicRect', editing, rect)
      return rect
    }
    
    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const { editing, size } = options
      if (!size) return true
      
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: definitionSize} = this.asset
      return sizeAboveZero(definitionSize)
    }

    itemContentRect(containerRect: Rect, time: Time): Rect {
      // console.log(this.constructor.name, 'itemContentRect', containerRect)
      const timeRange = this.clip.timeRange

      const contentArgs: ContentRectArgs = {
        containerRects: containerRect, time, timeRange, editing: true
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }
  }
}
