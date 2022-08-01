import { SvgItem } from "../declarations"
import { Rect, rectFromSize, RectTuple, RectZero } from "../Utility/Rect"

import { Errors } from "../Setup/Errors"
import { isArray } from "../Utility/Is"
import { Content, ContentClass } from "./Content"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { tweenCoverPoints, tweenCoverSizes, tweenRectsLock } from "../Utility/Tween"
import { DataGroup, Property, propertyInstance } from "../Setup/Property"
import { DataType, Orientation } from "../Setup/Enums"
import { SelectedProperties } from "../Utility/SelectedProperty"
import { Actions } from "../Editor/Actions/Actions"

export function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { isDefault } = this
      if (!isDefault) {
        this.addProperties(object, propertyInstance({
          name: 'x', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        this.addProperties(object, propertyInstance({
          name: 'y', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        
        this.addProperties(object, propertyInstance({
          name: 'lock', type: DataType.String, defaultValue: Orientation.H,
          group: DataGroup.Size, 
        }))
      }
    }

    contentRects(containerRects: Rect | RectTuple, time: Time, timeRange: TimeRange, forFiles?: boolean): RectTuple {
      if (forFiles && !this.intrinsicsKnown) {
        return isArray(containerRects) ? containerRects : [containerRects, containerRects]
      }

      const { lock, intrinsicRect } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = lock ? tweenRectsLock(tweenRects, lock) : tweenRects
      
      const coverSizes = tweenCoverSizes(intrinsicRect, containerRects, locked)
      const [size, sizeEnd] = coverSizes 
      const coverPoints = tweenCoverPoints(coverSizes, containerRects, locked)
      const [point, pointEnd] = coverPoints
      return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)]
    }

    contentSvgItem(containerRect: Rect, time: Time, timeRange: TimeRange): SvgItem {
      const [contentRect] = this.contentRects(containerRect, time, timeRange)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return this.svgItem(rect, time, timeRange, true)
    }
    
    intrinsicRectInitialize(): Rect { return RectZero }

    get isDefault() { 
      return this.definitionId === "com.moviemasher.content.default" 
    }
    
    selectedProperties(actions: Actions, property: Property): SelectedProperties {
      const { isDefault } = this
      const { name } = property

      const selectedProperties: SelectedProperties = []
      const colorKeys = ['lock', 'width', 'height', 'x', 'y']
      if (isDefault && colorKeys.includes(name)) return selectedProperties

      selectedProperties.push(...super.selectedProperties(actions, property))
      return selectedProperties
    }

    svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
      throw new Error(Errors.unimplemented) 
    }
  }
}
