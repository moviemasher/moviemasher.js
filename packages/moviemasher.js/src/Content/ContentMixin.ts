import { Rect, Scalar, SvgContent } from "../declarations"
import { Dimensions, dimensionsCover } from "../Setup/Dimensions"
import { CommandFiles, CommandFilters, ContentCommandFileArgs, ContentCommandFilterArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"

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
    contentCommandFilters(args: ContentCommandFilterArgs): CommandFilters {
      return []
    }

    contentCommandFiles(args: ContentCommandFileArgs): CommandFiles {
      return this.graphFiles(args).map(file => ({ ...file, inputId: this.id }))
    }

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }

    intrinsicDimensions(): Dimensions { return { width: 0, height: 0 }}

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
      const [x] = this.tweenValues('x', time, range)
      const [y] = this.tweenValues('y', time, range)
      assertPositive(x)
      assertPositive(y)
      const intrinsicDimensions = this.intrinsicDimensions()
      const coverDimensions = dimensionsCover(intrinsicDimensions, containerRect)
      const rect = {
        ...coverDimensions,
        x: containerRect.x + (x * (containerRect.width - coverDimensions.width)),
        y: containerRect.y + (y * (containerRect.height - coverDimensions.height)),
      }
      return this.svgContent(rect)
    }
  
    svgContent(rect: Rect): SvgContent {
      throw new Error(Errors.unimplemented) 
    }
    
    private _overlayFilter?: Filter
    get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}

  }
}
