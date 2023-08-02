import type { ContentRectArgs, PropertySize } from '@moviemasher/runtime-shared'
import type {IntrinsicOptions} from '@moviemasher/runtime-shared'
import type {Rect} from '@moviemasher/runtime-shared'
import type {Time} from '@moviemasher/runtime-shared'

import { assertSizeAboveZero, sizeAboveZero } from '../../Utility/SizeFunctions.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { POINT_ZERO } from '../../Utility/PointConstants.js'
import { rectFromSize } from '../../Utility/RectFunctions.js'
import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleAsset } from '@moviemasher/runtime-shared'
import { Instance, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'
import { End } from '../../Base/PropertiedConstants.js'
import { TypeContainer, TypeContent } from '@moviemasher/runtime-client'

export function VisibleInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    colorMaximize = true

    declare asset: VisibleAsset

    hasIntrinsicSizing = true

    override initializeProperties(object: VisibleInstanceObject): void {
      
      const { container } = object 
      const hasDimensions = container || !this.isDefault
      if (hasDimensions) {
        const { properties } = this
        const hasWidth = properties.some(property => property.name.endsWith('width'))
        const hasHeight = properties.some(property => property.name.endsWith('height'))
        const min = container ? 0.0 : 1.0
        const targetId = container ? TypeContainer : TypeContent
        if (!hasWidth) {
          this.properties.push(propertyInstance({
            targetId, name: 'width', type: DataTypePercent, 
            defaultValue: 1.0, min, max: 2.0, step: 0.01, tweens: true,
          }))
          this.properties.push(propertyInstance({
            targetId, name: `width${End}`, type: DataTypePercent, 
            step: 0.01, max: 2.0, min, undefinedAllowed: true, tweens: true,
          }))
        }
        if (!hasHeight) {
          this.properties.push(propertyInstance({
            targetId, name: 'height', type: DataTypePercent,
            defaultValue: 1.0, max: 2.0, min, step: 0.01, tweens: true,
          }))
          this.properties.push(propertyInstance({
            targetId, name: `height${End}`, type: DataTypePercent, 
            step: 0.01, max: 2.0, min, undefinedAllowed: true, tweens: true,
          }))
      }
      }
      super.initializeProperties(object)
    }

    intrinsicRect(editing = false): Rect {
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: size } = this.asset
      assertSizeAboveZero(size, key)
      const rect = { ...POINT_ZERO, ...size } 
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

    itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect {
      // console.log(this.constructor.name, 'itemContentRect', containerRect)
      const timeRange = this.clip.timeRange

      const contentArgs: ContentRectArgs = {
        containerRects: [containerRect], time, timeRange, editing: true, shortest
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }
  }
}
