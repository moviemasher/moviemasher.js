import { Rect, Scalar, SvgContent, SvgFilters, UnknownObject } from "../declarations"
import { Dimensions, dimensionsTransformToRect } from "../Setup/Dimensions"
import { CommandFiles, CommandFilters, ContainerCommandFileArgs, ContainerCommandFilterArgs, FilterCommandFilterArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"
import { Actions } from "../Editor/Actions/Actions"
import { Filter } from "../Filter/Filter"
import { Directions, SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedArray, isAboveZero, isBelowOne, isDefined, isNumber, isRect, isTimeRange, isUndefined } from "../Utility/Is"
import { Container, ContainerClass, ContainerDefinition, ContainerObject } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgGroupElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { intrinsicHeight, intrinsicWidth } = object as ContainerObject
      if (isNumber(intrinsicHeight) && isNumber(intrinsicWidth)) {
        this._intrinsicDimensions = {
          width: intrinsicWidth, height: intrinsicHeight
        }
        // console.log(this.constructor.name, "intrinsicDimensions", this._intrinsicDimensions, this.id)
      }
    }

    private _blendFilter?: Filter
    get blendFilter() { return this._blendFilter ||= filterFromId('blend')}


    containerCommandFiles(args: ContainerCommandFileArgs): CommandFiles {
      return this.graphFiles(args).map(file => ({ ...file, inputId: this.id }))
    }

    containerCommandFilters(args: ContainerCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput: input } = args
      let filterInput = input 

      const opacityFilters = this.opacityCommandFilters(args)
      if (opacityFilters.length) {
        commandFilters.push(...opacityFilters)
        filterInput = arrayLast(arrayLast(opacityFilters).outputs)
      }
      

      commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    containerRects(outputDimensions: Dimensions, time: Time, timeRange: TimeRange, forFiles = false): Rect[] {
      const rects: Rect[] = []
      const [x, xEnd] = this.tweenValues('x', time, timeRange)
      const [y, yEnd] = this.tweenValues('y', time, timeRange)
      const [width, widthEnd] = this.tweenValues('width', time, timeRange)
      const [height, heightEnd] = this.tweenValues('height', time, timeRange)

      const scaleRect = { x, y, width, height }
      rects.push(dimensionsTransformToRect(outputDimensions, scaleRect))
      
      if (isDefined(xEnd) || isDefined(yEnd) || isDefined(widthEnd) || isDefined(heightEnd)) {
        const tweenRect = { 
          ...scaleRect, x: xEnd, y: yEnd, width: widthEnd, height: heightEnd 
        }
        rects.push(dimensionsTransformToRect(outputDimensions, tweenRect, this.constrainWidth, this.constrainHeight))
      }
      return rects
    }

    containerSvg(rect: Rect): SvgContent { 
      throw new Error(Errors.unimplemented) 
    }

    containerSvgFilters(previewDimensions: Dimensions, containerRect: Rect, time: Time, range: TimeRange): SvgFilters {
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

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }


    private _intrinsicDimensions?: Dimensions
    intrinsicDimensions(): Dimensions { 
      return this._intrinsicDimensions ||= this.intrinsicDimensionsInitialize 
    }


    protected get intrinsicDimensionsInitialize(): Dimensions { 
      throw new Error(Errors.unimplemented) 
    }

    get intrinsicGroupElement(): SVGGElement {
      return svgGroupElement(this.intrinsicDimensions())
    }


    get instrinsicsKnown(): boolean { return true }

    mutable = false

    muted = false
    
    private _overlayFilter?: Filter
    get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}

    declare height: number

    declare mode: number

    declare opacity: number
    

    opacityCommandFilters(args: ContainerCommandFilterArgs): CommandFilters {
      const { outputDimensions, filterInput, clipTime, time, videoRate } = args
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const commandFilters: CommandFilters = []
      const filterCommandFilterArgs: FilterCommandFilterArgs = {
        dimensions: outputDimensions, filterInput, videoRate, duration
      }
      const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
      if (isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd))) {
        const { opacityFilter } = this
        opacityFilter.setValues({ opacity, opacityEnd })
        commandFilters.push(...opacityFilter.commandFilters(filterCommandFilterArgs))
      }
      return commandFilters
    }


    private _opacityFilter?: Filter
    get opacityFilter() { return this._opacityFilter ||= filterFromId('opacity')}

    pathElement(previewDimensions: Dimensions, forecolor?: string): SvgContent {
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
      const dimensions = this.intrinsicDimensions()
      const { width, height } = dimensions
      const json = super.toJSON()
      json.intrinsicWidth = width
      json.intrinsicHeight = height
      return json
    }

    translateCommandFilters(args: ContainerCommandFilterArgs) {

      const { 
        outputDimensions, time, containerRects, chainInput, filterInput, videoRate
      } = args
      assertPopulatedArray(containerRects)
      const [rect, rectEnd] = containerRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
   
      const mode = this.value('mode')
      const useBlend = isAboveZero(mode)
      const filter = useBlend ? this.blendFilter : this.overlayFilter
      if (useBlend) filter.setValue(mode, 'mode')
      
      filter.setValue(rect.x, 'x')
      filter.setValue(rect.y, 'y')
      if (duration && isRect(rectEnd)) {
        filter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
        filter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      }

      
      // const { 
         
      // } = args
      // assertDimensions(outputDimensions)
      // assertRect(rect)

      // const rectTransform = tweenRectTransform(rect, rectEnd)

      // const [x, xEnd] = this.tweenValues('x', time, clipTime)
      // const [y, yEnd] = this.tweenValues('y', time, clipTime)
      // assertPositive(x)
      // assertPositive(y)

      
      // assertDimensions(outputDimensions)
      // assertPopulatedArray(containerRects)

      const commandFilters: CommandFilters = []

      const filterCommandFilterArgs: FilterCommandFilterArgs = {
        dimensions: outputDimensions, filterInput, videoRate, duration, chainInput
      }
      

      
      // assertPositive(x)
      // assertPositive(y)

      // filter.setValue(dimensionPad(outputDimensions.width, x, rect.width / outputDimensions.width, this.constrainWidth), 'x')
      // filter.setValue(dimensionPad(outputDimensions.height, y, rect.height / outputDimensions.height, this.constrainHeight), 'y')

      // if (duration) {

      //   const xDefined = isNumber(xEnd) && rectEnd ? dimensionPad(outputDimensions.width, xEnd, rectEnd.width / outputDimensions.width, this.constrainWidth) : undefined
      //   const yDefined = isNumber(yEnd) && rectEnd ? dimensionPad(outputDimensions.height, yEnd, rectEnd.height / outputDimensions.height, this.constrainHeight) : undefined

      //   filter.setValue(xDefined, `x${PropertyTweenSuffix}`)
      //   filter.setValue(yDefined, `y${PropertyTweenSuffix}`)
      // }
      commandFilters.push(...filter.commandFilters(filterCommandFilterArgs))
      return commandFilters
    }

    declare width: number

    declare x: number

    declare y: number
  }
}
