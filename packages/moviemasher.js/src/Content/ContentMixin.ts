import { SvgItem } from "../declarations"
import { Rect, rectFromSize, RectTuple, RectZero } from "../Utility/Rect"

import { Errors } from "../Setup/Errors"
import { isArray } from "../Utility/Is"
import { Content, ContentClass } from "./Content"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { tweenCoverPoints, tweenCoverSizes, tweenRectsLock } from "../Utility/Tween"

export function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {
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

    mutable = false

    muted = false

    get isDefault() { 
      return this.definitionId === "com.moviemasher.content.default" 
    }
  
    svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
      throw new Error(Errors.unimplemented) 
    }
  }
}
