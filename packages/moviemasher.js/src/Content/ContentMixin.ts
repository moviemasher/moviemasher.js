import { Scalar, SvgContent } from "../declarations"
import { Rect } from "../Utility/Rect"
import { Size, dimensionsCover } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, SelectedProperties } from "../MoveMe"

import { Actions } from "../Editor/Actions/Actions"
import { SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPositive, isUndefined } from "../Utility/Is"
import { Content, ContentClass } from "./Content"
import { Filter } from "../Filter/Filter"
import { filterFromId } from "../Filter/FilterFactory"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"

export function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {
    intrinsicSize(): Size { return { width: 0, height: 0 }}

    mutable = false

    muted = false

    selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties {
      const selectedProperties: SelectedProperties = []
      this.properties.forEach(property => {
        selectedProperties.push({
          selectType, property, value: this.value(property.name),
          changeHandler: (property: string, value: Scalar) => {
            const undoValue = this.value(property)
            const redoValue = isUndefined(value) ? undoValue : value
            actions.create({ property, target: this, redoValue, undoValue })
          },
        })
      })
      return selectedProperties
    }

    contentSvg(containerRect: Rect, time: Time, range: TimeRange): SvgContent {
      const [point] = this.tweenPoints(time, range)
      const { x, y } = point
      
      const intrinsicSize = this.intrinsicSize()
      const coverSize = dimensionsCover(intrinsicSize, containerRect)
      const rect = {
        ...coverSize,
        x: containerRect.x + (x * (containerRect.width - coverSize.width)),
        y: containerRect.y + (y * (containerRect.height - coverSize.height)),
      }
      return this.svgContent(rect, time, range)
    }
  
    svgContent(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgContent {
      throw new Error(Errors.unimplemented) 
    }
  }
}
