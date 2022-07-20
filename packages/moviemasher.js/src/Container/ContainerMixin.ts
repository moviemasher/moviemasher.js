import { Scalar, SvgContent, SvgFilters, UnknownObject } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, SelectedProperties } from "../MoveMe"
import { Actions } from "../Editor/Actions/Actions"
import { Filter } from "../Filter/Filter"
import { Directions, SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isAboveZero, isBelowOne, isDefined, isNumber, isTimeRange, isUndefined } from "../Utility/Is"
import { Container, ContainerClass, ContainerDefinition, ContainerObject } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgGroupElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"
import { tweenMaxSize, tweenOverRect, tweenRectsEqual, tweenScaleSizeToRect } from "../Utility/Tween"


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { intrinsicHeight, intrinsicWidth } = object as ContainerObject
      if (isNumber(intrinsicHeight) && isNumber(intrinsicWidth)) {
        this._intrinsicSize = {
          width: intrinsicWidth, height: intrinsicHeight
        }
        // console.log(this.constructor.name, "intrinsicSize", this._intrinsicSize, this.id)
      }
    }

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
      const tweeningSize = !tweenRectsEqual(...containerRects)
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

    containerRects(outputSize: Size, time: Time, timeRange: TimeRange, forFiles = false): RectTuple {
      const scales = this.tweenRects(time, timeRange)
      // console.log(this.constructor.name, "containerRects scales", scales, outputSize)
      const [scale, scaleEnd] = scales
      const { constrainX, constrainY } = this
      const transformedRect = tweenScaleSizeToRect(outputSize, scale, constrainX, constrainY)

      if (tweenRectsEqual(scale, scaleEnd)) return [transformedRect, transformedRect]

      const tweenRect = tweenOverRect(scale, scaleEnd)
      const tweened = tweenScaleSizeToRect(outputSize, tweenRect, constrainX, constrainY)

      const tuple: RectTuple = [transformedRect, tweened]
      // console.log(this.constructor.name, "containerRects", constrainX, constrainY, tuple, scales)
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
    
    get directions() { return Directions }
    
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


    private _intrinsicSize?: Size
    intrinsicSize(): Size { 
      return this._intrinsicSize ||= this.intrinsicSizeInitialize 
    }


    protected get intrinsicSizeInitialize(): Size { 
      throw new Error(Errors.unimplemented) 
    }

    get intrinsicGroupElement(): SVGGElement {
      return svgGroupElement(this.intrinsicSize())
    }


    get instrinsicsKnown(): boolean { return true }

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

    pathElement(previewSize: Size, time: Time, range: TimeRange, forecolor?: string): SvgContent {
      throw new Error(Errors.unimplemented)
    }

    private _scaleFilter?: Filter
    get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}


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

    private _setsarFilter?: Filter
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar')}

    toJSON(): UnknownObject {
      const dimensions = this.intrinsicSize()
      const { width, height } = dimensions
      const json = super.toJSON()
      json.intrinsicWidth = width
      json.intrinsicHeight = height
      return json
    }

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
