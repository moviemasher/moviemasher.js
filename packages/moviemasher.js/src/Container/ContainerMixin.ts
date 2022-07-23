import { Scalar, SvgContent, SvgFilters } from "../declarations"
import { Rect, rectsEqual, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, SelectedProperties } from "../MoveMe"
import { Actions } from "../Editor/Actions/Actions"
import { Filter } from "../Filter/Filter"
import { Anchors, DirectionObject, Directions, SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isAboveZero, isBelowOne, isDefined, isTimeRange, isUndefined } from "../Utility/Is"
import { Container, ContainerClass, ContainerDefinition } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgGroupElement, svgPolygonElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"
import { tweenMaxSize, tweenOverRect, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from "../Utility/Tween"
import { pointsEqual, PointZero } from "../Utility/Point"
import { NamespaceSvg } from "../Setup/Constants"


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {

    private _blendFilter?: Filter
    get blendFilter() { return this._blendFilter ||= filterFromId('blend')}

    private _colorizeFilter?: Filter
    get colorizeFilter() { return this._colorizeFilter ||= filterFromId('colorize')}

    colorizeCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { contentColors: colors, videoRate, filterInput, time } = args
      assertPopulatedArray(colors)
      const duration = isTimeRange(time) ? time.lengthSeconds : 0

      const { colorizeFilter } = this
      const filterArgs: FilterCommandFilterArgs = {
        videoRate, duration, filterInput
      }
      const [color, colorEnd] = colors
      colorizeFilter.setValue(color, 'color')
      colorizeFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      
      return colorizeFilter.commandFilters(filterArgs)
    }

    colorMaximize = false

    containerColorCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { visible, contentColors, containerRects } = args
      if (!visible) return commandFilters

      const { colorMaximize } = this
      if (!colorMaximize) return super.containerColorCommandFilters(args)
      
      assertPopulatedArray(contentColors)
      assertPopulatedArray(containerRects)

      // console.log(this.constructor.name, "initialCommandFilters", noContentFilters, contentColors, filterInput)
      const tweeningSize = !rectsEqual(...containerRects)
      const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
      const colorArgs: CommandFilterArgs = { 
        ...args, outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      
      return commandFilters
    }

    
    containerCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { contentColors, filterInput: input, visible } = args
      if (!visible) return commandFilters

      // console.log(this.constructor.name, "containerCommandFilters")

      let filterInput = input
      assertPopulatedString(filterInput, 'filterInput')

      if (!contentColors?.length) {
        commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      } 
      commandFilters.push(...this.finalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    containerRects(size: Size, time: Time, timeRange: TimeRange, forFiles = false): RectTuple {
      const { lock, intrinsicsKnown } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = lock ? tweenRectsLock(tweenRects, lock) : tweenRects
      
      const [scale, scaleEnd] = locked 
      const inRect = forFiles && !intrinsicsKnown ? { ...size, ...PointZero } : this.intrinsicRect
      const { width: inWidth, height: inHeight, x: inX, y: inY } = inRect
      
      const ratio = ((inWidth || size.width) + inX) / ((inHeight || size.height) + inY)

      const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)

      const { directionObject } = this
      const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject)

      const tweening = !pointsEqual(scale, scaleEnd)
      if (!tweening) return [transformedRect, transformedRect]

      const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock)
      const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
      const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject)
      const tuple: RectTuple = [transformedRect, tweened]
      return tuple
    }

    containerSvg(rect: Rect, time: Time, range: TimeRange): SvgContent { 
      throw new Error(Errors.unimplemented) 
    }

    containerSvgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters {
      const svgFilters: SvgFilters = []
      const mode = this.value('mode')
      if (isAboveZero(mode)) {
        const { blendFilter } = this
        blendFilter.setValue(mode, 'mode')
        svgFilters.push(...blendFilter.filterSvgFilters(time.isRange))
      }
      return svgFilters
    }

  
    declare definition: ContainerDefinition
    
    get directions() { return Anchors }

    get directionObject(): DirectionObject {
      return Object.fromEntries(Directions.map(direction => 
        [direction, !!this.value(`off${direction}`)]
      ))
    }
    
    finalCommandFilters(args: CommandFilterArgs): CommandFilters {
      // console.log(this.constructor.name, "finalCommandFilters")
      const commandFilters: CommandFilters = []
      const { filterInput: input, visible } = args

      let filterInput = input 
      assertPopulatedString(filterInput, 'filterInput')
      if (visible) {
        const opacityFilters = this.opacityCommandFilters(args)
        if (opacityFilters.length) {
          commandFilters.push(...opacityFilters)
          filterInput = arrayLast(arrayLast(opacityFilters).outputs)
        }  
        commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))
      } else {
        commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
      }
      return commandFilters
    }

    get intrinsicGroupElement(): SVGGElement {
      return svgGroupElement(this.intrinsicRect)
    }


    mutable = false

    muted = false
    
 
    declare height: number

    declare mode: number

    declare opacity: number
    

    opacityCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { outputSize: outputSize, filterInput, clipTime, time, videoRate } = args
      assertTimeRange(clipTime)
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const commandFilters: CommandFilters = []
      const filterCommandFilterArgs: FilterCommandFilterArgs = {
        dimensions: outputSize, filterInput, videoRate, duration
      }
      const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, "opacityCommandFilters", opacity, opacityEnd)
      if (isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd))) {
        const { opacityFilter } = this
        opacityFilter.setValues({ opacity, opacityEnd })
        commandFilters.push(...opacityFilter.commandFilters(filterCommandFilterArgs))
      }
      
      return commandFilters
    }


    private _opacityFilter?: Filter
    get opacityFilter() { return this._opacityFilter ||= filterFromId('opacity')}
    
    pathElement(rect: Rect, time: Time, range: TimeRange, forecolor = 'transparent'): SvgContent {
      return svgPolygonElement(rect, '', forecolor)
    }

    private _scaleFilter?: Filter
    get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}



    private _setsarFilter?: Filter
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar')}

    translateCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { 
        outputSize, time, containerRects, chainInput, filterInput, videoRate
      } = args
      assertPopulatedArray(containerRects)
      const [rect, rectEndOrEmpty] = containerRects
      const rectEnd = rectEndOrEmpty || {}
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
   
      const mode = this.value('mode')
      const useBlend = isAboveZero(mode)
      const filter = useBlend ? this.blendFilter : this.overlayFilter
      if (useBlend) filter.setValue(mode, 'mode')
      
      filter.setValue(rect.x, 'x')
      filter.setValue(rect.y, 'y')
      if (duration) {
        filter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
        filter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      }
      const commandFilters: CommandFilters = []

      const filterArgs: FilterCommandFilterArgs = {
        dimensions: outputSize, filterInput, videoRate, duration, chainInput
      }
      commandFilters.push(...filter.commandFilters(filterArgs))
      return commandFilters
    }

    declare width: number

    declare x: number

    declare y: number
  }
}
