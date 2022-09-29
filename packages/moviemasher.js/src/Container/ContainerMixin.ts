import { SvgItem } from "../declarations"
import { Rect, rectsEqual, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from "../MoveMe"
import { Filter } from "../Filter/Filter"
import { Anchors, DataType, DirectionObject, Directions } from "../Setup/Enums"
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isBelowOne, isDefined, isTimeRange } from "../Utility/Is"
import { Container, ContainerClass, DefaultContainerId, ContainerDefinition, ContainerRectArgs } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgFilterElement, svgPolygonElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"
import { Tweening, tweenMaxSize, tweenOverRect, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from "../Utility/Tween"
import { DataGroup, propertyInstance } from "../Setup/Property"


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      
      this.addProperties(object, propertyInstance({
        name: 'x', type: DataType.Percent, defaultValue: 0.5,
        group: DataGroup.Point, tweenable: true, 
      }))
      this.addProperties(object, propertyInstance({
        name: 'y', type: DataType.Percent, defaultValue: 0.5,
        group: DataGroup.Point, tweenable: true, 
      }))
      
      // offN, offS, offE, offW
      Directions.forEach(direction => {
        this.addProperties(object, propertyInstance({
          name: `off${direction}`, type: DataType.Boolean, 
          group: DataGroup.Point,
        }))
      })
      
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'opacity', 
        type: DataType.Percent, defaultValue: 1.0,
        group: DataGroup.Opacity,
      }))
    }

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
    
    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { contentColors, containerRects, track } = args
    
      const { colorMaximize } = this
      if (!colorMaximize) return super.containerColorCommandFilters(args)
      
      assertPopulatedArray(contentColors)

      const tweeningSize = !rectsEqual(...containerRects)
      const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `content-${track}`))
      
      return commandFilters
    }

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const { contentColors, filterInput: input } = args
      let filterInput = input
      // console.log(this.constructor.name, "containerCommandFilters", filterInput)
      
      assertPopulatedString(filterInput, 'filterInput')

      if (!contentColors?.length) {
        commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      } 

      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput: input } = args

      let filterInput = input 
      assertPopulatedString(filterInput, 'filterInput')
     
      const opacityFilters = this.opacityCommandFilters(args)
      if (opacityFilters.length) {
        commandFilters.push(...opacityFilters)
        filterInput = arrayLast(arrayLast(opacityFilters).outputs)
      }  
      commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))
    
      return commandFilters
    }

    containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple {
      // console.log(this.constructor.name, "containerRects", inRect, args)
      const { size, time, timeRange } = args
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = tweenRectsLock(tweenRects, lock)
      
      const { width: inWidth, height: inHeight } = inRect
      
      const ratio = ((inWidth || size.width)) / ((inHeight || size.height))
      
      const [scale, scaleEnd] = locked 
      const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)
      // console.log(this.constructor.name, "containerRects forcedScale", forcedScale, "= tweenScaleSizeRatioLock(", scale, size, ratio, lock, ")")
      const { directionObject } = this
      const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject)

      const tweening = !rectsEqual(scale, scaleEnd)
      if (!tweening) {
        // console.log(this.constructor.name, "containerRects !tweening", transformedRect, locked)
        return [transformedRect, transformedRect]
      }

      const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock)
      const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
      const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject)
      const tuple: RectTuple = [transformedRect, tweened]
      return tuple
    }

    containerPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> { 
      return Promise.resolve(this.pathElement(containerRect))
    }
  
    containerSvgFilter(svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const [opacity] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, "containerSvgFilters", opacity)
      if (!isBelowOne(opacity)) return 
      
      const { opacityFilter } = this
      opacityFilter.setValue(opacity, 'opacity')
      return svgFilterElement(opacityFilter.filterSvgFilter(), svgItem)
    }

    declare definition: ContainerDefinition
    
    get directions() { return Anchors }

    get directionObject(): DirectionObject {
      return Object.fromEntries(Directions.map(direction => 
        [direction, !!this.value(`off${direction}`)]
      ))
    }

    get isDefault() { return this.definitionId === DefaultContainerId }


    declare height: number

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
    
    pathElement(rect: Rect, forecolor = 'none'): SvgItem {
      return svgPolygonElement(rect, '', forecolor)
    }

    translateCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        outputSize, time, containerRects, chainInput, filterInput, videoRate
      } = args
      if (!chainInput) return commandFilters

      assertPopulatedArray(containerRects)
      const [rect, rectEnd] = containerRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const { overlayFilter } = this
      overlayFilter.setValue(rect.x, 'x')
      overlayFilter.setValue(rect.y, 'y')
      if (duration) {
        overlayFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
        overlayFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      }
      const filterArgs: FilterCommandFilterArgs = {
        dimensions: outputSize, filterInput, videoRate, duration, chainInput
      }
      commandFilters.push(...overlayFilter.commandFilters(filterArgs))
      return commandFilters
    }

    declare width: number

    declare x: number

    declare y: number
  }
}
