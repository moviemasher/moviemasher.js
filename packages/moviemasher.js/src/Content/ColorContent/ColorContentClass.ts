import { Rect, SvgContent } from "../../declarations"
import { ColorContent, ColorContentDefinition } from "./ColorContent"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Filter } from "../../Filter/Filter"
import { ContentMixin } from "../ContentMixin"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"

const ColorContentWithTweenable = TweenableMixin(InstanceBase)
const ColorContentWithContent = ContentMixin(ColorContentWithTweenable)
export class ColorContentClass extends ColorContentWithContent implements ColorContent {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
   
    this.addProperties(object, propertyInstance({
        tweenable: true, name: 'color', type: DataType.Rgb, 
        defaultValue: this.definition.color
      })
    )
  }

  declare color: string

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  contentSvg(containerRect: Rect, time: Time, range: TimeRange): SvgContent {
    const { colorFilter } = this
    const [color] = this.tweenValues('color', time, range)
    const { x, y, width, height } = containerRect
    colorFilter.setValues({ x, y, width, height, color })
    return colorFilter.filterSvg()
  }

  declare definition: ColorContentDefinition
}
