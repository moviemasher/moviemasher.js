import { PropertyTweenSuffix } from "../../Base"
import { SvgItem } from "../../declarations"
import { Rect, rectsEqual } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { DataType } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isTimeRange } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableSize, UpdatableSizeClass, UpdatableSizeDefinition, UpdatableSizeObject } from "./UpdatableSize"
import { Tweening, tweenMaxSize } from "../../Utility/Tween"
import { colorBlack, colorBlackOpaque } from "../../Utility/Color"
import { PointZero } from "../../Utility/Point"
import { ContentRectArgs } from "../../Content/Content"
import { assertSizeAboveZero, sizeAboveZero } from "../../Utility/Size"

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

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      // console.log(this.constructor.name, "containerCommandFilters")
      const commandFilters: CommandFilters = []
      const { 
        commandFiles, containerRects, filterInput: input, videoRate, track 
      } = args
      let filterInput = input

      const maxSize = tweening.size ? tweenMaxSize(...containerRects) : containerRects[0]
  
      // add color box first
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [colorBlackOpaque, colorBlackOpaque],
        outputSize: maxSize, //{ width: maxSize.width * 2, height: maxSize.height * 2 }
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `container-${track}-back`))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
      const fileInput = commandFilesInput(commandFiles, this.id, true)

      // then add file input, scaled
      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      if (tweening.size) {
        // overlay scaled file input onto color box
        assertPopulatedString(filterInput, 'overlay input')
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      }
      // crop file input
      const cropArgs: FilterCommandFilterArgs = { duration: 0, videoRate }
      assertPopulatedString(filterInput, 'crop input')
      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, "width")
      cropFilter.setValue(maxSize.height, "height")
      cropFilter.setValue(0, "x")
      cropFilter.setValue(0, "y")
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      if (!tweening.size) {
        // overlay scaled and cropped file input onto color box
        assertPopulatedString(filterInput, 'overlay input')
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
 
      }
     
      // add effects...
      const effectsFilters = this.effectsCommandFilters({ ...args, filterInput })
      if (effectsFilters.length) {
        commandFilters.push(...effectsFilters)
        filterInput = arrayLast(arrayLast(effectsFilters).outputs)
      }

      assertPopulatedString(filterInput, 'alphamerge input')
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      // then we need to do effects, opacity, etc, and merge
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerSvgItem(rect: Rect, time: Time, range: TimeRange, icon?: boolean): SvgItem {
      return this.svgItem(rect, time, range, true, icon)
    }

    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        containerRects, visible, time, videoRate, clipTime, 
        commandFiles, filterInput: input, track
      } = args
      if (!visible) return commandFilters

      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      let filterInput = input || commandFilesInput(commandFiles, this.id, visible)

      const contentArgs: ContentRectArgs = {
        rects: containerRects, time, timeRange: clipTime
      }
      const contentRects = this.contentRects(contentArgs)

      const tweeningContainer = !rectsEqual(...containerRects)

      // console.log(this.constructor.name, "contentCommandFilters", containerRects, contentRects)
      const [contentRect, contentRectEnd] = contentRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const maxContainerSize = tweeningContainer ? tweenMaxSize(...containerRects) : containerRects[0]
     
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, contentColors: [colorBlack, colorBlack], 
        outputSize: maxContainerSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `content-${track}-back`))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    
      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))
      
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
   
      if (tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      }
      
      const cropArgs: FilterCommandFilterArgs = { 
        duration, videoRate
      }
      const { cropFilter } = this
      cropFilter.setValue(maxContainerSize.width, "width")
      cropFilter.setValue(maxContainerSize.height, "height")
      cropFilter.setValue(contentRect.x, "x")
      cropFilter.setValue(contentRect.y, "y")
      cropFilter.setValue(contentRectEnd.x, `x${PropertyTweenSuffix}`)
      cropFilter.setValue(contentRectEnd.y, `y${PropertyTweenSuffix}`)
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
  
      if (!tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      }
      
      commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening))
      return commandFilters
    }

    declare definition: UpdatableSizeDefinition

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput, track } = args
    
      if (container) {
        // relabel input as content
        assertPopulatedString(filterInput)
        commandFilters.push(this.copyCommandFilter(filterInput, track))
      } 
      return commandFilters
    }

    intrinsicRect(editing = false): Rect {
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: size } = this.definition
      assertSizeAboveZero(size, key)
      return { ...size, ...PointZero }
    }
    
    intrinsicsKnown(editing = false) {
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: size} = this.definition
      return sizeAboveZero(size)
    }
  }
}
