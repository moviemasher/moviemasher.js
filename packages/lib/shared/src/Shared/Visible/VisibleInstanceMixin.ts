import type { Constrained, ContentRectArgs, Instance, IntrinsicOptions, PropertySize, Rect, Time, VisibleAsset, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'

import { END, POINT_ZERO, SIZE_ZERO, TARGET_CONTAINER, TARGET_CONTENT } from '@moviemasher/runtime-shared'
import { DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { rectFromSize } from '../../Utility/RectFunctions.js'
import { assertSizeAboveZero, sizeAboveZero } from '../../Utility/SizeFunctions.js'

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
        const targetId = container ? TARGET_CONTAINER : TARGET_CONTENT
        if (!hasWidth) {
          this.properties.push(propertyInstance({
            targetId, name: 'width', type: DataTypePercent, 
            defaultValue: 1.0, min, max: 2.0, step: 0.01, tweens: true,
          }))
          this.properties.push(propertyInstance({
            targetId, name: `width${END}`, type: DataTypePercent, 
            step: 0.01, max: 2.0, min, undefinedAllowed: true, tweens: true,
          }))
        }
        if (!hasHeight) {
          this.properties.push(propertyInstance({
            targetId, name: 'height', type: DataTypePercent,
            defaultValue: 1.0, max: 2.0, min, step: 0.01, tweens: true,
          }))
          this.properties.push(propertyInstance({
            targetId, name: `height${END}`, type: DataTypePercent, 
            step: 0.01, max: 2.0, min, undefinedAllowed: true, tweens: true,
          }))
      }
      }
      super.initializeProperties(object)
    }

    intrinsicRect(_editing?: boolean): Rect {
      const { sourceSize: size = SIZE_ZERO } = this.asset
      // assertSizeAboveZero(size)

      const rect = { ...POINT_ZERO, ...size } 
      // console.log(this.constructor.name, 'intrinsicRect', editing, rect)
      return rect
    }
    
    intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (options.size) return sizeAboveZero(this.asset.sourceSize)
      
      return super.intrinsicsKnown(options)
    }

    itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect {
      // console.log(this.constructor.name, 'itemContentRect', containerRect)
      const timeRange = this.clip.timeRange

      const contentArgs: ContentRectArgs = {
        containerRects: [containerRect, containerRect], time, timeRange, editing: true, shortest
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }
  }
}
