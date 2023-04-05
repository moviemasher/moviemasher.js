import { SvgItem } from '../../../Helpers/Svg/Svg.js'
import { Rect } from '../../../Utility/Rect.js'
import { ColorContent, ColorContentDefinition } from './ColorContent.js'
import { Filter } from '../../../Plugin/Filter/Filter.js'
import { ContentMixin } from '../ContentMixin.js'
import { filterFromId } from '../../../Plugin/Filter/FilterFactory.js'
import { TweenableMixin } from '../../../Mixin/Tweenable/TweenableMixin.js'
import { Time, TimeRange } from '../../../Helpers/Time/Time.js'
import { DataType } from '../../../Setup/Enums.js'
import { DataGroup, propertyInstance } from '../../../Setup/Property.js'
import { ColorTuple, Component } from '../../../Base/Code.js'
import { assertPopulatedString, isPopulatedString } from '../../../Utility/Is.js'
import { MediaInstanceBase } from '../../MediaInstanceBase.js'

const ColorContentWithTweenable = TweenableMixin(MediaInstanceBase)
const ColorContentWithContent = ContentMixin(ColorContentWithTweenable)
export class ColorContentClass extends ColorContentWithContent implements ColorContent {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
   
    this.addProperties(object, propertyInstance({
      tweenable: true, name: 'color', type: DataType.Rgb, 
      defaultValue: this.definition.color, group: DataGroup.Color
    }))
  }

  declare color: string

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  contentColors(time: Time, range: TimeRange): ColorTuple {
    const [color, colorEndOrNot] = this.tweenValues('color', time, range)
    assertPopulatedString(color)
    const colorEnd = isPopulatedString(colorEndOrNot) ? colorEndOrNot : color
    return [color, colorEnd]
  }

  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
    const { colorFilter } = this
    const [color] = this.tweenValues('color', time, range)
    const { x, y, width, height } = containerRect
    colorFilter.setValues({ width, height, color })
    const [svg] =  colorFilter.filterSvgs()
    svg.setAttribute('x', String(x))
    svg.setAttribute('y', String(y))
    return Promise.resolve(svg)
  }

  declare definition: ColorContentDefinition
}
