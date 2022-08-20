import { SvgItem, SvgFilters } from "../declarations"
import { Rect, rectsEqual, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from "../MoveMe"
import { Filter } from "../Filter/Filter"
import { Anchors, DataType, DirectionObject, Directions, Orientation } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isBelowOne, isDefined, isTimeRange } from "../Utility/Is"
import { Container, ContainerClass, ContainerDefinition, ContainerRectArgs } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgGroupElement, svgPolygonElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"
import { Tweening, tweenMaxSize, tweenOverRect, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from "../Utility/Tween"
import { PointZero } from "../Utility/Point"
import { DataGroup, propertyInstance } from "../Setup/Property"
import { Editor } from "../Editor/Editor"


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
      
      this.addProperties(object, propertyInstance({
        name: 'lock', type: DataType.String, defaultValue: Orientation.H,
        group: DataGroup.Size, 
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
    attachHandlers(svgItem: SvgItem, editor: Editor): void {
      // const { window } = globalThis
      // const { clip } = this
    
      // const svgParentDiv = (element: Element): HTMLDivElement | null => {
      //   const { parentNode } = element
      //   if (parentNode === null || !(parentNode instanceof Element)) {
      //     return null
      //   }
      //   if (parentNode instanceof HTMLDivElement) return parentNode
      //   return svgParentDiv(parentNode)
      // }
      // const pointerUp =  (event: PointerEvent) => {
      //   console.log(this.constructor.name, "svgEditingContent pointerUp", clip.label, event)
      //   window.removeEventListener('pointermove', pointerMove)
      //   window.removeEventListener('pointerup', pointerUp)
      //   eventStop(event)
      // } 
      // const pointerMove = (event: PointerEvent) => {
      //   const div = svgParentDiv(svgItem)
      //   if (div) {
      //     const clientRect = div.getBoundingClientRect()
      //     const { movementX, movementY, x, y, screenX, screenY } = event
      //     // const redoValues: ScalarObject = {

      //     // }
      //     // const undoValues: ScalarObject = {
            
      //     // }
          
      //     // const args: ActionObject = {
      //     //   property: DataGroup.Point,
      //     //   target: this,
      //     //   type: ActionType.ChangeMultiple, redoValues, undoValues 
      //     // }
      //     // editor.actions.create(args)
      //     console.log(this.constructor.name, "svgEditingContent pointerMove", clip.label, x, y, screenX, screenY , clientRect)
          
      //     eventStop(event)
      //   } else pointerUp(event)
      // } 
      
      // const pointerDown = (event: Event) => {
      //   console.log(this.constructor.name, "svgEditingContent pointerDown", clip.label, event)
      //   window.addEventListener('pointermove', pointerMove)
      //   window.addEventListener('pointerup', pointerUp)
  
      //   editor.selection.set(clip)
      //   eventStop(event)
      // }
      // const pointerDragStart = (event: Event) => {
      //   console.log(this.constructor.name, "svgEditingContent pointerDragStart", clip.label, event)
      //   window.addEventListener('pointermove', pointerMove)
      //   window.addEventListener('pointerup', pointerUp)
  
      //   // editor.selection.set(clip)
      //   eventStop(event)
      // }
      // svgItem.setAttribute('draggable', 'true')
      // svgItem.addEventListener('dragstart', pointerDragStart)
      // svgItem.addEventListener('pointerdown', pointerDown)
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

      // add effects...
      const effectsFilters = this.effectsCommandFilters({ ...args, filterInput })
      if (effectsFilters.length) {
        commandFilters.push(...effectsFilters)
        filterInput = arrayLast(arrayLast(effectsFilters).outputs)
      }
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

    containerRects(args: ContainerRectArgs): RectTuple {
      const { size, time, timeRange, loading, editing } = args
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = lock ? tweenRectsLock(tweenRects, lock) : tweenRects
      
      const loadingSize = loading && !this.intrinsicsKnown(editing)
      const inRect = loadingSize ? { ...size, ...PointZero } : this.intrinsicRect(editing)

      // console.log(this.constructor.name, "containerRects inRect=", inRect, loadingSize, editing, tweenRects)

      const { width: inWidth, height: inHeight, x: inX, y: inY } = inRect
      
      const ratio = ((inWidth || size.width) + inX) / ((inHeight || size.height) + inY)

      const [scale, scaleEnd] = locked 
      const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)

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
      // console.log(this.constructor.name, "containerRects", tuple, tweenRects, locked)

      return tuple
    }

    containerSvgItem(rect: Rect, time: Time, range: TimeRange): SvgItem { 
      throw new Error(Errors.unimplemented) 
    }

    containerSvgFilters(outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SvgFilters {
      const svgFilters: SvgFilters = []
      svgFilters.push(...this.effects.flatMap(effect => effect.svgFilters(outputSize, containerRect, time, clipTime)))
      
      const [opacity] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, "containerSvgFilters", opacity)
      if (isBelowOne(opacity)) {
        const { opacityFilter } = this
        opacityFilter.setValue(opacity, 'opacity')
        svgFilters.push(...opacityFilter.filterSvgFilters())
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

    get intrinsicGroupElement(): SVGGElement {
      return svgGroupElement(this.intrinsicRect(true))
    }

    get isDefault() { 
      return this.definitionId === "com.moviemasher.container.default" 
    }


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
    
    pathElement(rect: Rect, forecolor = 'transparent', editor?: Editor): SvgItem {
      const svgItem = svgPolygonElement(rect, '', forecolor)
      if (editor) this.attachHandlers(svgItem, editor)
      return svgItem
    }

    translateCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { 
        outputSize, time, containerRects, chainInput, filterInput, videoRate
      } = args
      assertPopulatedArray(containerRects)
      const [rect, rectEndOrEmpty] = containerRects
      const rectEnd = rectEndOrEmpty || {}
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
   
    
      const { overlayFilter } = this
      
      overlayFilter.setValue(rect.x, 'x')
      overlayFilter.setValue(rect.y, 'y')
      if (duration) {
        overlayFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
        overlayFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      }
      const commandFilters: CommandFilters = []

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
