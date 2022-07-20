import { PropertyTweenSuffix } from "../../Base"
import { SvgContent } from "../../declarations"
import { Point, PointZero } from "../../Utility/Point"
import { Rect, RectTuple } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs } from "../../MoveMe"
import { Size, dimensionsCover, dimensionsScale, dimensionsEven } from "../../Utility/Size"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { assertAboveZero, assertPopulatedArray, assertPopulatedString, assertTimeRange, isAboveZero, isPopulatedArray, isTimeRange } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableSize, UpdatableSizeClass, UpdatableSizeDefinition, UpdatableSizeObject } from "./UpdatableSize"
import { tweenMaxSize, tweenRectsEqual } from "../../Utility/Tween"
import { colorBlack, colorBlackOpaque, colorRed } from "../../Utility/Color"

export function UpdatableSizeMixin<T extends PreloadableClass>(Base: T): UpdatableSizeClass & T {
  return class extends Base implements UpdatableSize {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { container } = object as UpdatableSizeObject
      const min = container ? 0.0 : 1.0
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'width', 
        type: DataType.Percent, defaultValue: 1.0, max: 2.0, min
      }))
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'height', type: DataType.Percent, 
        defaultValue: 1.0, max: 2.0, min
      }))
    }
    
    colorMaximize = true

    containerCommandFilters(args: CommandFilterArgs): CommandFilters {
      // console.log(this.constructor.name, "containerCommandFilters")
      const commandFilters: CommandFilters = []
      const { visible, commandFiles, videoRate, containerRects } = args
      if (!visible) return commandFilters

      assertPopulatedArray(containerRects)
      const tweeningSize = !tweenRectsEqual(...containerRects)
      const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
  
      const colorArgs: CommandFilterArgs = { 
        ...args, contentColors: [colorBlackOpaque, colorBlackOpaque], outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))

      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
      
      const fileInput = commandFilesInput(commandFiles, this.id, visible)
      
      // first we need to scale file 
      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      let filterInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      const overlayArgs: CommandFilterArgs = { 
        ...args, filterInput, chainInput: colorInput, outputSize: maxSize
      }
      commandFilters.push(...this.mergeCommandFilters(overlayArgs))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      // we are ALWAYS masking, either our content or color filter
      assertPopulatedString(filterInput, 'crop input')
      const cropArgs: FilterCommandFilterArgs = { 
        duration: 0, videoRate, filterInput
      }
      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, "width")
      cropFilter.setValue(maxSize.height, "height")
      cropFilter.setValue(0, "x")
      cropFilter.setValue(0, "y")
      commandFilters.push(...cropFilter.commandFilters(cropArgs))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      assertPopulatedString(filterInput, 'alphamerge input')
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      // then we need to do opacity, etc, and merge
      commandFilters.push(...this.finalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerSvg(rect: Rect, time: Time, range: TimeRange): SvgContent {
      return this.svgContent(rect, time, range, true)
    }

    contentCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { containerRects, visible, time, videoRate, clipTime, commandFiles, filterInput: input } = args
      if (!visible) return commandFilters

      let filterInput = input || commandFilesInput(commandFiles, this.id, visible)
      
      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      const [rect, rectEnd] = containerRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
          
      const intrinsicSize = this.intrinsicSize()
      const unscaledSize = dimensionsCover(intrinsicSize, rect)
      const unscaledSizeEnd = dimensionsCover(intrinsicSize, rectEnd)

      const [scale, scaleEnd] = this.tweenRects(time, clipTime)
      const { x, y, width, height } = scale
      const { x: xEnd, y: yEnd, width: widthEnd, height: heightEnd } = scaleEnd
      
      const coverSize = dimensionsEven(dimensionsScale(unscaledSize, width, height))
      const coverSizeEnd = dimensionsEven(dimensionsScale(unscaledSizeEnd, widthEnd, heightEnd))
      const coverRect: Rect = { ...coverSize, x: 0, y: 0 }
      const coverRectEnd: Rect = { ...coverSizeEnd, x: 0, y: 0 }
      const coverRects: RectTuple = [coverRect, coverRectEnd]
      const maxSize = tweenMaxSize(...containerRects) 

      const maxCoverRect = { 
          ...tweenMaxSize(...coverRects), ...PointZero
        }
      const colorArgs: CommandFilterArgs = { 
        ...args, contentColors: [colorBlack, colorBlack], 
        outputSize: maxCoverRect
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: coverRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      // if (tweeningSize) {
      

        const overlayArgs: CommandFilterArgs = { 
          ...args, filterInput, chainInput: colorInput, 
        }
        commandFilters.push(...this.mergeCommandFilters(overlayArgs))
       
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      // }
      
      const point: Point = {
        x: x * (coverSize.width - rect.width),
        y: y * (coverSize.height - rect.height),
      }
      const pointEnd: Point = {
        x: xEnd * (coverSizeEnd.width - rectEnd.width),
        y: yEnd * (coverSizeEnd.height - rectEnd.height),
      }
      // const moving = !pointsEqual(point, pointEnd)
      // const zero = !moving && pointsEqual(point, PointZero)
      
      // if (!zero) {
        // console.log(this.constructor.name, "contentCommandFilters adding crop", point, pointEnd)
        const cropArgs: FilterCommandFilterArgs = { 
          duration, videoRate, filterInput
        }
        const { cropFilter } = this
        cropFilter.setValue(maxSize.width, "width")
        cropFilter.setValue(maxSize.height, "height")
        cropFilter.setValue(point.x, "x")
        cropFilter.setValue(point.y, "y")
        cropFilter.setValue(pointEnd.x, `x${PropertyTweenSuffix}`)
        cropFilter.setValue(pointEnd.y, `y${PropertyTweenSuffix}`)
        commandFilters.push(...cropFilter.commandFilters(cropArgs))
      // }
      return commandFilters
    }

    declare definition: UpdatableSizeDefinition

    initialCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput, container, visible, contentColors, track, containerRects } = args
      if (!visible) return commandFilters
      
      // const contentInput = `content-${track}`
      if (container) {
        // const noContentFilters = isPopulatedArray(contentColors)
        // // console.log(this.constructor.name, "initialCommandFilters", noContentFilters, contentColors, filterInput)
        // if (noContentFilters) {
        //   // add color filter to mask - will tween color/size, but not position
        //   assertPopulatedArray(containerRects)
        //   const tweeningSize = !tweenRectsEqual(...containerRects)
        //   const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
        //   const colorArgs: CommandFilterArgs = { 
        //     ...args, outputSize: maxSize
        //   }
        //   commandFilters.push(...this.colorBackCommandFilters(colorArgs))
        //   arrayLast(commandFilters).outputs = [contentInput]
        // } 
        // else { 
          // relabel input as content
          assertPopulatedString(filterInput)
          commandFilters.push(this.copyCommandFilter(filterInput, track))
        // }
      } 
      return commandFilters
    }

    intrinsicSize(): Size { 
      const { width, height } = this.definition
      assertAboveZero(width, "updatable width")
      assertAboveZero(height, "updatable height")
      return { width, height }
    }
    
    get intrinsicsKnown() {
      const { width, height } = this.definition
      return isAboveZero(width) && isAboveZero(height)
    }
  }
}
