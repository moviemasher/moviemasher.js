import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Scalar } from "../../declarations"
import { Filter } from "../../Filter/Filter"
import { filterFromId } from "../../Filter/FilterFactory"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Point, PointTuple } from "../../Utility/Point"
import { assertRect, RectTuple } from "../../Utility/Rect"
import { DataType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { colorBlackOpaque, colorName, colorWhite } from "../../Utility/Color"
import { idGenerate } from "../../Utility/Id"
import { assertAboveZero, assertArray, assertNumber, assertPopulatedString, assertTrue, isNumber, isPopulatedArray, isTimeRange, isUndefined } from "../../Utility/Is"
import { assertSize, Size, SizeTuple } from "../../Utility/Size"
import { tweenColorStep, tweenNumberStep, tweenOverPoint, tweenOverSize } from "../../Utility/Tween"
import { Tweenable, TweenableClass, TweenableDefinition, TweenableObject } from "./Tweenable"

export function TweenableMixin<T extends InstanceClass>(Base: T): TweenableClass & T {
  return class extends Base implements Tweenable {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { container } = object as TweenableObject
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'x', type: DataType.Percent, defaultValue: 0.5 
      }))
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'y', type: DataType.Percent, defaultValue: 0.5
      }))
      if (container) {
        this.addProperties(object, propertyInstance({ type: DataType.Mode }))
        this.addProperties(object, propertyInstance({
          tweenable: true, name: 'opacity', 
          type: DataType.Percent, defaultValue: 1.0
        }))
      }
      

      this.addProperties(object, propertyInstance({
        name: 'constrainY', type: DataType.Boolean
      }))
      this.addProperties(object, propertyInstance({
        name: 'constrainX', type: DataType.Boolean
      }))
    }

    alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = [] 
      const { videoRate, outputSize: rect, track, filterInput } = args
      assertPopulatedString(filterInput)
      assertAboveZero(videoRate)
      assertSize(rect)
      
      const chainInput = `content-${track}`
      const filterCommandFilterArgs: FilterCommandFilterArgs = { 
        videoRate: 0, duration: 0, filterInput, chainInput 
      } 
      commandFilters.push(...this.alphamergeFilter.commandFilters(filterCommandFilterArgs))
      return commandFilters
    }

    _alphamergeFilter?: Filter 
    get alphamergeFilter() { return this._alphamergeFilter ||= filterFromId('alphamerge') }


    amixCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { chainInput, filterInput } = args
      assertPopulatedString(chainInput)
      assertPopulatedString(filterInput)
      const amixFilter = 'amix' 
      // const amixId = idGenerate(amixFilter)
      const commandFilters: CommandFilters = []
      const commandFilter: CommandFilter = {

        inputs: [chainInput, filterInput], 
        ffmpegFilter: amixFilter, 
        options: { normalize: 0 }, outputs: []
      }

      commandFilters.push(commandFilter)
      return commandFilters
    }

    canColor(args: CommandFilterArgs): boolean { return false }

    canColorTween(args: CommandFilterArgs): boolean { return false }

    colorCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = [] 
      const { contentColors: colors = [], containerRects, videoRate, time } = args
      assertArray(containerRects, 'containerRects')
      const [rect, rectEndOrEmpty = {}] = containerRects
      assertRect(rect)
  
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const colorArgs: FilterCommandFilterArgs = { videoRate, duration } 
  
      const rectEnd = { ...rect, ...rectEndOrEmpty }
  
      const { colorFilter } = this
      const [color, colorEnd] = colors
            
      colorFilter.setValue(color || colorWhite, 'color')
      colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      colorFilter.setValue(rect.width, 'width')
      colorFilter.setValue(rect.height, 'height')
      
      colorFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
      colorFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)
      commandFilters.push(...colorFilter.commandFilters(colorArgs))
      return commandFilters
    }
    
    _colorFilter?: Filter
    get colorFilter() { return this._colorFilter ||= filterFromId('color') }

    commandFiles(args: CommandFileArgs): CommandFiles {
      const { visible } = args
      const graphFileArgs: GraphFileArgs = { ...args, audible: !visible }
      const commandFiles: CommandFiles = [] 
      const graphFiles = this.graphFiles(graphFileArgs)
      let inputCount = 0
      commandFiles.push(...graphFiles.map((graphFile, index) => {
        const { input } = graphFile
        const inputId = index && input ? `${this.id}-${inputCount}` : this.id
        const commandFile: CommandFile = { ...graphFile, inputId }
        if (input) inputCount++
        return commandFile
      }))
      return commandFiles
    }
    
    commandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { visible, container, filterInput: input = '', contentColors } = args
      let filterInput = input
      if (container && visible) {
        const hasColorContent = isPopulatedArray(contentColors)
        if (hasColorContent) {
          assertTrue(!filterInput.length, '!filterInput')

          const tweening = contentColors[0] !== contentColors[1]
          const can = tweening ? this.canColorTween(args) : this.canColor(args)
          if (!can) {
            commandFilters.push(...this.containerColorCommandFilters(args))
            filterInput = arrayLast(arrayLast(commandFilters).outputs)
          }
        }
      }

      // console.log(this.constructor.name, "commandFilters", container)
      const initialFilters = this.initialCommandFilters({ ...args, filterInput })
      if (initialFilters.length) {
        commandFilters.push(...initialFilters)
        filterInput = arrayLast(arrayLast(initialFilters).outputs)
      }
      if (container) commandFilters.push(...this.containerCommandFilters({ ...args, filterInput }))
      else commandFilters.push(...this.contentCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    declare constrainX: boolean

    declare constrainY: boolean

    containerColorCommandFilters(args: CommandFilterArgs): CommandFilters { 
      return this.colorCommandFilters(args)
    }

    containerCommandFilters(args: CommandFilterArgs): CommandFilters { 
      console.log(this.constructor.name, "containerCommandFilters returning empty")
      return [] 
    }

    contentCommandFilters(args: CommandFilterArgs): CommandFilters { 
      console.log(this.constructor.name, "contentCommandFilters returning empty")
      return [] 
    }

    copyCommandFilter(input: string, track: number, prefix = 'content'): CommandFilter {
      const contentOutput = `${prefix}-${track}`
      const commandFilter: CommandFilter = {
        inputs: [input], ffmpegFilter: 'copy', options: {}, outputs: [contentOutput]
      }
      return commandFilter
    }
  
    private _cropFilter?: Filter 
    get cropFilter() { return this._cropFilter ||= filterFromId('crop') }

    finalCommandFilters(args: CommandFilterArgs): CommandFilters { return [] }

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }

    initialCommandFilters(args: CommandFilterArgs): CommandFilters {
      throw new Error(Errors.unimplemented)
    }
    private _overlayFilter?: Filter
    get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}


    colorBackCommandFilters(args: CommandFilterArgs): CommandFilters { 
      const { time, contentColors = [], videoRate, outputSize } = args
      assertSize(outputSize)

      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const [color = colorBlackOpaque, colorEnd = colorBlackOpaque] = contentColors
      const { colorFilter } = this
      const colorArgs: FilterCommandFilterArgs = { videoRate, duration } 
      colorFilter.setValue(color, 'color')
      colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      colorFilter.setValue(outputSize.width, 'width')
      colorFilter.setValue(outputSize.height, 'height')
      colorFilter.setValue(outputSize.width, `width${PropertyTweenSuffix}`)
      colorFilter.setValue(outputSize.height, `height${PropertyTweenSuffix}`)
      
      const commandFilters = colorFilter.commandFilters(colorArgs)
      arrayLast(commandFilters).outputs = [idGenerate(colorName(color) || 'back')]
      return commandFilters
    }


    mergeCommandFilters(args: CommandFilterArgs): CommandFilters { 
      const commandFilters: CommandFilters = [] 
      const { chainInput, filterInput } = args
     
      assertPopulatedString(chainInput, 'chainInput')
      assertPopulatedString(filterInput, 'filterInput')
     
      const overlayArgs: FilterCommandFilterArgs = {
        filterInput, chainInput, videoRate: 0, duration: 0
      }

      const { overlayFilter } = this
      overlayFilter.setValue(0, 'x')
      overlayFilter.setValue(0, 'y')

      commandFilters.push(...overlayFilter.commandFilters(overlayArgs))
      const commandFilter = arrayLast(commandFilters)
      commandFilter.outputs = [idGenerate('merged')]
      return commandFilters
    }

    scaleCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { time, containerRects, filterInput: input, videoRate } = args
      let filterInput = input
      assertPopulatedString(filterInput, 'filterInput')

      assertArray(containerRects, 'containerRects')
      const [rect, rectEndOrEmpty = {}] = containerRects
      assertRect(rect)
      const rectEnd = { ...rect, ...rectEndOrEmpty }
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      // console.log(this.constructor.name, "scaleCommandFilters", containerRects, duration)
      const commandFilters: CommandFilters = []
      
      const { scaleFilter, setsarFilter } = this
      const filterCommandFilterArgs: FilterCommandFilterArgs = { 
        duration, videoRate, filterInput
      }
      scaleFilter.setValue(rect.width, 'width')
      scaleFilter.setValue(rect.height, 'height')
      scaleFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
      scaleFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)  
      commandFilters.push(...scaleFilter.commandFilters(filterCommandFilterArgs))
      // filterCommandFilterArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      // setsarFilter.setValue(1, 'max')
      // setsarFilter.setValue(1, 'sar')
      // commandFilters.push(...setsarFilter.commandFilters(filterCommandFilterArgs))
      // filterCommandFilterArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      return commandFilters
    }

    private _scaleFilter?: Filter
    get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}
     
    private _setsarFilter?: Filter
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar') }

    _setptsFilter?: Filter
    get setptsFilter() { return this._setptsFilter ||= filterFromId('setpts')}

    tween(keyPrefix: string, time: Time, range: TimeRange): Scalar {
      const value = this.value(keyPrefix)
      const valueEnd = this.value(`${keyPrefix}${PropertyTweenSuffix}`)
      if (isUndefined(valueEnd)) return value

      const { frame: rangeFrame, frames } = range
      const { frame: timeFrame } = time
      const frame = timeFrame - rangeFrame
      if (isNumber(value)) {
        assertNumber(valueEnd)
        return tweenNumberStep(value, valueEnd, frame, frames)
      }
      assertPopulatedString(value)
      assertPopulatedString(valueEnd)
      return tweenColorStep(value, valueEnd, frame, frames)
    }

    tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
      const values: Scalar[] = []
      const isRange = isTimeRange(time)
      values.push(this.tween(key, isRange ? time.startTime : time, range))
      if (isRange) values.push(this.tween(key, time.endTime, range))
      return values
    }

    tweenPoints(time: Time, range: TimeRange): PointTuple {
      const [x, xEndOrNot] = this.tweenValues('x', time, range)
      const [y, yEndOrNot] = this.tweenValues('y', time, range)
      assertNumber(x)
      assertNumber(y)
      const point: Point = { x, y } 
      const tweenPoint = { x: xEndOrNot, y: yEndOrNot }
      return [point, tweenOverPoint(point, tweenPoint)]
    }

    tweenSizes(time: Time, range: TimeRange): SizeTuple {
      const [width, widthEndOrNot] = this.tweenValues('width', time, range)
      const [height, heightEndOrNot] = this.tweenValues('height', time, range)
      assertNumber(width)
      assertNumber(height)
      const size: Size = { width, height } 
      const tweenSize = { width: widthEndOrNot, height: heightEndOrNot }
      return [size, tweenOverSize(size, tweenSize)]
    }

    tweenRects(time: Time, range: TimeRange): RectTuple {
      const [size, sizeEnd] = this.tweenSizes(time, range)
      const [point, pointEnd] = this.tweenPoints(time, range)
      return [ { ...point , ...size }, { ...pointEnd , ...sizeEnd } ]
    }
    
    declare definition: TweenableDefinition
  }
}
