import type { MaybeComplexSvgItem, ColorAsset, ColorInstance, ColorInstanceObject, Constrained, ContentSvgItemArgs, DataOrError, IntrinsicOptions, Rect, Value, VisibleAsset, VisibleInstance } from '../types.js'

import { $CONTENT, $END, $IMAGE, RECT_ZERO, $RGB, RGB_GRAY } from '../runtime.js'
import { isDefined } from '../utility/guard.js'
import { assertPopulatedString } from '../utility/guards.js'
import { svgOpacity, svgPolygonElement } from '../utility/svg.js'

export function ColorAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false
    canBeContent = true
    canBeFill = true
    hasIntrinsicSizing = false
    type = $IMAGE
  }
}

const pixelColor = (value : Value) : string => {
  const string = String(value)
  if (string.startsWith('0x')) {
    // console.log('pixelColor starts with 0x', string)
    return `#${string.slice(2)}`
  }
  return string
}


export function ColorInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ColorInstance> {
  return class extends Base implements ColorInstance {
    declare asset: ColorAsset

    declare color: string

    declare colorEnd?: string

    override contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { time, timeRange, opacity, contentRect } = args
      const [color] = this.tweenValues('color', time, timeRange)
      assertPopulatedString(color)
      
      const polygon = svgPolygonElement(contentRect, '', pixelColor(color))
      const data = svgOpacity(polygon, opacity)
      return { data }
    }
    
    override initializeProperties(object: ColorInstanceObject): void {
      this.properties.push(this.propertyInstance({
        targetId: $CONTENT, name: 'color', type: $RGB,
        defaultValue: RGB_GRAY, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTENT, name: `color${$END}`,
        type: $RGB, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }
    override get intrinsicRect(): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

    override get tweening(): boolean { 
      let tweening = super.tweening
      
      const { colorEnd } = this
      tweening ||= isDefined(colorEnd) && colorEnd !== this.color
      
      return tweening
     }


  }
}
