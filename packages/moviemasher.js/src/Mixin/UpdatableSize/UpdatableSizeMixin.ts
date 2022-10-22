import { PropertyTweenSuffix } from "../../Base"
import { SvgItem } from "../../declarations"
import { Rect, rectFromSize, rectsEqual } from "../../Utility/Rect"
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
import { colorBlack, colorBlackOpaque, colorTransparent } from "../../Utility/Color"
import { PointZero } from "../../Utility/Point"
import { ContentRectArgs } from "../../Content/Content"
import { assertSizeAboveZero, Size, sizeAboveZero, sizeCopy } from "../../Utility/Size"
import { IntrinsicOptions } from "../../Edited/Mash/Track/Clip/Clip"
import { svgSetDimensions } from "../../Utility/Svg"
import { urlPrependProtocol } from "../../Utility/Url"
import { filterFromId } from "../../Filter/FilterFactory"
import { Filter } from "../../Filter/Filter"

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

      const { id } = this
      // console.log(this.constructor.name, "containerCommandFilters calling commandFilesInput", id)
      const fileInput = commandFilesInput(commandFiles, id, true)

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

      assertPopulatedString(filterInput, 'alphamerge input')
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      // then we need to do effects, opacity, etc, and merge
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
      return this.itemPromise(containerRect, time, range, icon)
    }

    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        containerRects, visible, time, videoRate, clipTime, 
        commandFiles, filterInput: input, track, upload
      } = args
      if (!visible) return commandFilters

      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      const { id } = this
      let filterInput = input || commandFilesInput(commandFiles, id, visible)

      const contentArgs: ContentRectArgs = {
        containerRects: containerRects, time, timeRange: clipTime
      }
      const contentRects = this.contentRects(contentArgs)

      const tweeningContainer = !rectsEqual(...containerRects)

      const [contentRect, contentRectEnd] = contentRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const maxContainerSize = tweeningContainer ? tweenMaxSize(...containerRects) : containerRects[0]
      const dont = false
      const colorInput = `content-${track}-back`
      if (!upload) {
        const colorArgs: VisibleCommandFilterArgs = { 
          ...args, contentColors: [colorTransparent, colorTransparent], 
          outputSize: maxContainerSize
        }
        commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput))
          
      }
    
      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))
      
      if (upload) return commandFilters

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

      const { setsarFilter } = this
      setsarFilter.setValue("1/1", "sar")

      commandFilters.push(...setsarFilter.commandFilters({ ...cropArgs, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

  
      if (!tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput, this.definition.alpha))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      }
      
      commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening))
      return commandFilters
    }
    private _setsarFilter?: Filter
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar')}


    declare definition: UpdatableSizeDefinition

    hasIntrinsicSizing = true
    
    iconUrl(size: Size, time: Time, clipTime: TimeRange): string {
      return this.definition.url
    }


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
      const rect = { ...PointZero, ...size } 
      // console.log(this.constructor.name, "intrinsicRect", editing, rect)
      return rect
    }
    
    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const { editing, size } = options
      if (!size) return true
      
      const key = editing ? 'previewSize' : 'sourceSize'
      const { [key]: definitionSize} = this.definition
      return sizeAboveZero(definitionSize)
    }

    private itemIconPromise(rect: Rect, time: Time, range: TimeRange, cache?: boolean): Promise<SvgItem> {
      const { clip } = this
      const { preloader } = clip.track.mash
      
      const url = this.iconUrl(sizeCopy(rect), time, range)
      const imageUrl = urlPrependProtocol('image', url)
      // const lock = stretch ? '' : Orientation.V
      const svgUrl = urlPrependProtocol('svg', imageUrl, { ...rect })
      
      const definition = cache ? this.definition : undefined
      return preloader.loadPromise(svgUrl, definition)
    }

    // protected previewItem?: SvgItem

    protected itemPreviewPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
      return this.itemIconPromise(rect, time, range)
    }

    itemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
      const { container } = this
      const rect = container ? containerRect : this.itemContentRect(containerRect, time, range)
      if (icon) return this.itemIconPromise(rect, time, range)
      
      return this.itemPreviewPromise(rect, time, range).then(svgItem => {
        svgSetDimensions(svgItem, rect)
        return svgItem
      })
    }


    private itemContentRect(containerRect: Rect, time: Time, timeRange: TimeRange): Rect {
      const contentArgs: ContentRectArgs = {
        containerRects: containerRect, time, timeRange, editing: true
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }

  }
}
