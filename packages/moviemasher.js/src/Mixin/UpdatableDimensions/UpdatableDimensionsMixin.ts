import { PropertyTweenSuffix } from "../../Base"
import { Point, Rect, SvgContent, ValueObject } from "../../declarations"
import { Filter } from "../../Filter/Filter"
import { filterFromId, filterInstance } from "../../Filter/FilterFactory"
import { CommandFilter, CommandFilters, ContentCommandFilterArgs, FilterCommandFilterArgs } from "../../MoveMe"
import { Dimensions, dimensionsCover } from "../../Setup/Dimensions"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { commandFilesInput, commandFilesInputIndex } from "../../Utility/CommandFiles"
import { idGenerate } from "../../Utility/Id"
import { assertAboveZero, assertArray, assertDimensions, assertNumber, assertPopulatedString, assertRect, isAboveZero, isDefined, isDimensions, isTimeRange } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableDimensions, UpdatableDimensionsClass, UpdatableDimensionsDefinition } from "./UpdatableDimensions"

export function UpdatableDimensionsMixin<T extends PreloadableClass>(Base: T): UpdatableDimensionsClass & T {
  return class extends Base implements UpdatableDimensions {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'width', 
        type: DataType.Percent, defaultValue: 1.0, max: 2.0, min: 1.0
      }))
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'height', type: DataType.Percent, 
        defaultValue: 1.0, max: 2.0, min: 1.0
      }))
    }
    
    declare definition: UpdatableDimensionsDefinition
    containerSvg(rect: Rect): SvgContent {
      return this.svgContent(rect, true)
    }

    contentCommandFilters(args: ContentCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { commandFiles, containerRects, visible, filterInput: input, time, videoRate, clipTime, outputDimensions } = args
      if (!visible) return commandFilters

      assertDimensions(outputDimensions)
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
    
      const filterInput = input || commandFilesInput(commandFiles, this.id, visible)
      assertPopulatedString(filterInput)

      assertArray(containerRects, 'containerRects')
      const [rect, rectEndOrEmpty = {}] = containerRects
      assertRect(rect)
      const rectEnd = { ...rect, ...rectEndOrEmpty }
      const intrinsicDimensions = this.intrinsicDimensions()

      const coverDimensions = dimensionsCover(intrinsicDimensions, rect)
      const coverDimensionsEnd = dimensionsCover(intrinsicDimensions, rectEnd)

      const [x, xEndOrNot] = this.tweenValues('x', time, clipTime)
      const [y, yEndOrNot] = this.tweenValues('y', time, clipTime)
      const xEnd = isDefined(xEndOrNot) ? xEndOrNot : x
      const yEnd = isDefined(yEndOrNot) ? yEndOrNot : y
    
      assertNumber(x)
      assertNumber(y)
      assertNumber(xEnd)
      assertNumber(yEnd)
      const point: Point = {
        x: x * ((this.constrainWidth ? 0 : coverDimensions.width) - rect.width),
        y: y * ((this.constrainHeight ? 0 : coverDimensions.height) - rect.height),
      }
      const pointEnd: Point = {
        x: xEnd * ((this.constrainWidth ? 0 :coverDimensionsEnd.width) - rectEnd.width),
        y: yEnd * ((this.constrainHeight ? 0 : coverDimensionsEnd.height) - rectEnd.height),
      }

      const filterCommandFilterArgs: FilterCommandFilterArgs = { 
        ...args, filterInput, dimensions: rect, duration, videoRate
      }
  
      const { scaleFilter, setptsFilter, setsarFilter, cropFilter } = this

      commandFilters.push(...setptsFilter.commandFilters(filterCommandFilterArgs))
      filterCommandFilterArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      scaleFilter.setValues({ ...coverDimensions })
      scaleFilter.setValue(coverDimensionsEnd.width, `width${PropertyTweenSuffix}`)
      scaleFilter.setValue(coverDimensionsEnd.height, `height${PropertyTweenSuffix}`)
      commandFilters.push(...scaleFilter.commandFilters(filterCommandFilterArgs))
      filterCommandFilterArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      cropFilter.setValue(outputDimensions.width, "width")
      cropFilter.setValue(outputDimensions.height, "height")
      cropFilter.setValue( point.x, "x")
      cropFilter.setValue( point.y, "y")
      cropFilter.setValue( pointEnd.x, `x${PropertyTweenSuffix}`)
      cropFilter.setValue( pointEnd.y, `y${PropertyTweenSuffix}`)

      commandFilters.push(...this.cropFilter.commandFilters(filterCommandFilterArgs))
      filterCommandFilterArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      return commandFilters
    }
    

    private _cropFilter?: Filter 
    private get cropFilter() { return this._cropFilter ||= filterFromId('crop') }

    intrinsicDimensions(): Dimensions { 
      const { width, height } = this.definition
      assertAboveZero(width, "updatable width")
      assertAboveZero(height, "updatable height")
      return { width, height }
    }
    
    get intrinsicsKnown() {
      const { width, height } = this.definition
      return isAboveZero(width) && isAboveZero(height)
    }

    private _scaleFilter?: Filter
    get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}

    private _setptsFilter?: Filter
    private get setptsFilter() { return this._setptsFilter ||= filterFromId('setpts')}

    private _setsarFilter?: Filter
    get setsarFilter() { 
      return this._setsarFilter ||= filterInstance({ id: 'setsar', sar: 1, max: 1 })
    }
  }


}
