import { SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { ColorContent, ColorContentDefinition } from "./ColorContent"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Filter } from "../../Filter/Filter"
import { ContentMixin } from "../ContentMixin"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { DataType } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { ColorTuple } from "../../MoveMe"
import { assertPopulatedString, isPopulatedString } from "../../Utility/Is"

const ColorContentWithTweenable = TweenableMixin(InstanceBase)
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

  contentSvgItem(containerRect: Rect, time: Time, range: TimeRange): SvgItem {
    const { colorFilter } = this
    const [color] = this.tweenValues('color', time, range)
    const { x, y, width, height } = containerRect
    colorFilter.setValues({ width, height, color })
    const svg =  colorFilter.filterSvg()
    svg.setAttribute('x', String(x))
    svg.setAttribute('y', String(y))
    return svg
  }

  declare definition: ColorContentDefinition
}
