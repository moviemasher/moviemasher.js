import { PropertyTweenSuffix } from "../../Base"
import { SvgItem } from "../../declarations"
import { Rect, rectsEqual } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs } from "../../MoveMe"
import { DataType } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { assertAboveZero, assertPopulatedArray, assertPopulatedString, assertTimeRange, isAboveZero, isTimeRange } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableSize, UpdatableSizeClass, UpdatableSizeDefinition, UpdatableSizeObject } from "./UpdatableSize"
import { tweenMaxSize } from "../../Utility/Tween"
import { colorBlack, colorBlackOpaque } from "../../Utility/Color"
import { PointZero } from "../../Utility/Point"

export function UpdatableSizeMixin<T extends PreloadableClass>(Base: T): UpdatableSizeClass & T {
  return class extends Base implements UpdatableSize {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { container } = object as UpdatableSizeObject
      const min = container ? 0.0 : 1.0
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'width', type: DataType.Percent, 
        group: DataGroup.Size, defaultValue: 1.0, max: 2.0, min
      }))
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'height', type: DataType.Percent, 
        group: DataGroup.Size, defaultValue: 1.0, max: 2.0, min
      }))
    }
    
    colorMaximize = true

    containerCommandFilters(args: CommandFilterArgs): CommandFilters {
      // console.log(this.constructor.name, "containerCommandFilters")
      const commandFilters: CommandFilters = []
      const { visible, commandFiles, videoRate, containerRects } = args
      if (!visible) return commandFilters

      assertPopulatedArray(containerRects)
      const tweeningSize = !rectsEqual(...containerRects)
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
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerSvgItem(rect: Rect, time: Time, range: TimeRange): SvgItem {
      return this.svgItem(rect, time, range, true)
    }

    contentCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { containerRects, visible, time, videoRate, clipTime, commandFiles, filterInput: input } = args
      if (!visible) return commandFilters

      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      let filterInput = input || commandFilesInput(commandFiles, this.id, visible)

      const contentRects = this.contentRects(containerRects, time, clipTime)
      const [contentRect, contentRectEnd] = contentRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const maxContainerSize = tweenMaxSize(...containerRects) 
     
      const colorArgs: CommandFilterArgs = { 
        ...args, contentColors: [colorBlack, colorBlack], 
        outputSize: maxContainerSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      const overlayArgs: CommandFilterArgs = { 
        ...args, filterInput, chainInput: colorInput, 
      }
      commandFilters.push(...this.mergeCommandFilters(overlayArgs))
      
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
   
      const cropArgs: FilterCommandFilterArgs = { 
        duration, videoRate, filterInput
      }
      const { cropFilter } = this
      cropFilter.setValue(maxContainerSize.width, "width")
      cropFilter.setValue(maxContainerSize.height, "height")
      cropFilter.setValue(contentRect.x, "x")
      cropFilter.setValue(contentRect.y, "y")
      cropFilter.setValue(contentRectEnd.x, `x${PropertyTweenSuffix}`)
      cropFilter.setValue(contentRectEnd.y, `y${PropertyTweenSuffix}`)
      commandFilters.push(...cropFilter.commandFilters(cropArgs))
    
      return commandFilters
    }

    declare definition: UpdatableSizeDefinition

    initialCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput, container, visible, track } = args
      if (!visible) return commandFilters
      
      if (container) {
        // relabel input as content
        assertPopulatedString(filterInput)
        commandFilters.push(this.copyCommandFilter(filterInput, track))
      } 
      return commandFilters
    }

    intrinsicRectInitialize(): Rect { 
      const { width, height } = this.definition
      assertAboveZero(width, "updatable width")
      assertAboveZero(height, "updatable height")
      return { width, height, ...PointZero }
    }
    
    get intrinsicsKnown() {
      const { width, height } = this.definition
      return isAboveZero(width) && isAboveZero(height)
    }
  }
}
