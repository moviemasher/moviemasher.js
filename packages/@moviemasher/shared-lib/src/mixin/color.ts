import type { ColorAsset, ColorInstance, ColorInstanceObject, ComplexSvgItem, Constrained, ContentFill, DataOrError, IdElement, IntrinsicOptions, PropertySize, Rect, StringTuple, SvgItem, SvgItemArgs, SvgVector, Time, Value, VisibleAsset, VisibleInstance } from '../types.js'

import { CONTENT, END, ERROR, IMAGE, NONE, RECT_ZERO, RGB, RGB_GRAY, isDefined, isPopulatedString, namedError } from '../runtime.js'
import { assertPopulatedString, assertStringTuple, isPositive } from '../utility/guards.js'
import { svgPolygonElement } from '../utility/svg.js'

export function ColorAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false
    canBeContent = true
    canBeFill = true

    type = IMAGE
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

    override contentSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem> {
      const { rect: containerRect, time, timeRange } = args
      const [color] = this.tweenValues('color', time, timeRange)
      // console.log('ColorInstanceMixin.contentSvgItem', { color, time, timeRange })
      assertPopulatedString(color)
  
      return { data: svgPolygonElement(containerRect, '', pixelColor(color)) }
    }

    // override fill(_containerRect: Rect, time: Time, _shortest: PropertySize): DataOrError<ContentFill> {
    //   const values = this.tweenValues('color', time, this.clip.timeRange)
    //   const [data] = values
    //   if (!isPopulatedString(data)) return namedError(ERROR.Unavailable, 'color')

    //   return { data }
    // }

    override initializeProperties(object: ColorInstanceObject): void {
      this.properties.push(this.propertyInstance({
        targetId: CONTENT, name: 'color', type: RGB,
        defaultValue: RGB_GRAY, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTENT, name: `color${END}`,
        type: RGB, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }
    override get intrinsicRect(): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

  
    override pathElement(rect: Rect, forecolor = NONE): SvgVector {
      return svgPolygonElement(rect, '', forecolor)
    }

    override get tweening(): boolean { 
      let tweening = super.tweening
      
      const { colorEnd } = this
      tweening ||= isDefined(colorEnd) && colorEnd !== this.color
      
      return tweening
     }


  }
}
