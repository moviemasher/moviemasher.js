import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Scalar, ScalarObject } from "../../declarations"
import { Filter } from "../../Filter/Filter"
import { filterFromId } from "../../Filter/FilterFactory"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { SelectedItems, SelectedProperties, SelectedProperty } from "../../Utility/SelectedProperty"
import { Point, PointTuple } from "../../Utility/Point"
import { assertRect, Rect, RectTuple } from "../../Utility/Rect"
import { ActionType, DataType, isSizingDefinitionType, isTimingDefinitionType, Orientation, SelectType, Sizing, Timing } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertProperty, Property } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { colorBlackOpaque, colorName, colorWhite } from "../../Utility/Color"
import { idGenerate } from "../../Utility/Id"
import { assertAboveZero, assertArray, assertNumber, assertObject, assertPopulatedString, isNumber, isTimeRange, isUndefined } from "../../Utility/Is"
import { assertSize, Size, sizeEven, sizesEqual, SizeTuple } from "../../Utility/Size"
import { tweenColorStep, Tweening, tweenNumberStep, tweenOverPoint, tweenOverSize } from "../../Utility/Tween"
import { Tweenable, TweenableClass, TweenableDefinition, TweenableObject } from "./Tweenable"
import { Actions } from "../../Editor/Actions/Actions"
import { Clip, IntrinsicOptions } from "../../Edited/Mash/Track/Clip/Clip"
import { Selectables } from "../../Editor/Selectable"
import { Defined } from "../../Base"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { Default } from "../../Setup/Default"

export function TweenableMixin<T extends InstanceClass>(Base: T): TweenableClass & T {
  return class extends Base implements Tweenable {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { container } = object as TweenableObject
      if (container) this.container = true
    }

    alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = [] 
      const { videoRate, outputSize: rect, track, filterInput } = args
      assertPopulatedString(filterInput)
      assertAboveZero(videoRate)
      assertSize(rect)
      
      const chainInput = `content-${track}`
      const filterArgs: FilterCommandFilterArgs = { 
        videoRate: 0, duration: 0, filterInput, chainInput 
      } 
      const { alphamergeFilter } = this
      commandFilters.push(...alphamergeFilter.commandFilters(filterArgs))
      return commandFilters
    }

    private _alphamergeFilter?: Filter 
    private get alphamergeFilter() { return this._alphamergeFilter ||= filterFromId('alphamerge') }

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

    private _clip?: Clip
    get clip() { return this._clip! }
    set clip(value: Clip) { this._clip = value }
    get clipped(): boolean { return !!this._clip }

    colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters { 
      const { contentColors = [], videoRate, outputSize, duration } = args
      assertSize(outputSize)
      const evenSize = sizeEven(outputSize)
      const [color = colorBlackOpaque, colorEnd = colorBlackOpaque] = contentColors
      const outputString = output || idGenerate(colorName(color) || 'back')
      const { colorFilter } = this
      const colorArgs: FilterCommandFilterArgs = { videoRate, duration } 
      colorFilter.setValue(color, 'color')
      colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      colorFilter.setValue(evenSize.width, 'width')
      colorFilter.setValue(evenSize.height, 'height')
      colorFilter.setValue(evenSize.width, `width${PropertyTweenSuffix}`)
      colorFilter.setValue(evenSize.height, `height${PropertyTweenSuffix}`)
      const commandFilters = colorFilter.commandFilters(colorArgs)
      
      if (sizesEqual(evenSize, outputSize)) {
        arrayLast(commandFilters).outputs = [outputString]
      } else {
        const filterInput = arrayLast(arrayLast(commandFilters).outputs)
        assertPopulatedString(filterInput, 'crop input')
        const cropFilter = 'crop'
        // const cropId = idGenerate(cropFilter)
        const cropCommandFilter: CommandFilter = {
          inputs: [filterInput], ffmpegFilter: cropFilter, 
          options: { w: outputSize.width, h: outputSize.height, exact: 1 }, 
          outputs: [outputString]
        }
        commandFilters.push(cropCommandFilter)
      }
      return commandFilters
    }
    
    _colorFilter?: Filter
    get colorFilter() { return this._colorFilter ||= filterFromId('color') }
    
    commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput: input = '' } = args
      let filterInput = input
      // console.log(this.constructor.name, "commandFilters", container)
      const initialFilters = this.initialCommandFilters(args, tweening, container)
      if (initialFilters.length) {
        commandFilters.push(...initialFilters)
        filterInput = arrayLast(arrayLast(initialFilters).outputs)
      }
      if (container) commandFilters.push(...this.containerCommandFilters({ ...args, filterInput }, tweening))
      else commandFilters.push(...this.contentCommandFilters({ ...args, filterInput }, tweening))
      return commandFilters
    }
   
    container = false

    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters { 
      const commandFilters: CommandFilters = [] 
      const { contentColors: colors = [], containerRects, videoRate, duration } = args
      assertArray(containerRects, 'containerRects')
      const [rect, rectEnd] = containerRects
  
      const colorArgs: FilterCommandFilterArgs = { videoRate, duration } 
  
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

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters { 
      // console.log(this.constructor.name, "containerCommandFilters returning empty")
      return [] 
    }

    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters { 
      return []
    }

    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters { 
      // console.log(this.constructor.name, "contentCommandFilters returning empty")
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
    
    declare definition: TweenableDefinition

    definitionTime(time : Time, clipTime: TimeRange) : Time {
      const { fps: quantize } = clipTime
      const scaledTime = time.scaleToFps(quantize) // may have fps higher than quantize and time.fps
      const { startTime, endTime } = clipTime
      const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
      return scaledTime.withFrame(frame - startTime.frame)
    }

    frames(quantize: number): number {
      return timeFromArgs(Default.duration, quantize).frame
    }

    fileCommandFiles(graphFileArgs: GraphFileArgs): CommandFiles {
      const commandFiles: CommandFiles = [] 
      const files = this.fileUrls(graphFileArgs)
      let inputCount = 0
      commandFiles.push(...files.map((graphFile, index) => {
        const { input } = graphFile
        const inputId = (index && input) ? `${this.id}-${inputCount}` : this.id
        const commandFile: CommandFile = { ...graphFile, inputId }
        if (input) inputCount++
        return commandFile
      }))
      return commandFiles
    }

    fileUrls(args: GraphFileArgs): GraphFiles { return [] }

    hasIntrinsicSizing = false

    hasIntrinsicTiming = false

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      throw new Error(Errors.unimplemented)
    }
    
    intrinsicRect(editing = false): Rect { 
      throw new Error(Errors.unimplemented) 
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

    intrinsicGraphFile(options: IntrinsicOptions): GraphFile {
      const { editing, size, duration } = options
      const clipTime = timeRangeFromArgs()
      const graphFileArgs: GraphFileArgs = {
        editing, time: clipTime.startTime, clipTime, quantize: clipTime.fps,
        visible: size, audible: duration,
      }
      const [graphFile] = this.fileUrls(graphFileArgs)
      assertObject(graphFile)
      
      return graphFile
    }

    get isDefault() { return false }

    declare lock: Orientation
    mutable() { return false }
    
    declare muted: boolean 
    


    overlayCommandFilters(bottomInput: string, topInput: string): CommandFilters { 
      assertPopulatedString(bottomInput, 'bottomInput')
      assertPopulatedString(topInput, 'topInput')

      const commandFilters: CommandFilters = [] 
      const overlayArgs: FilterCommandFilterArgs = {
        filterInput: topInput, chainInput: bottomInput, videoRate: 0, duration: 0
      }
      const { overlayFilter } = this
      // overlayFilter.setValue('yuv420p10', 'format')
      overlayFilter.setValue(0, 'x')
      overlayFilter.setValue(0, 'y')

      commandFilters.push(...overlayFilter.commandFilters(overlayArgs))
      const commandFilter = arrayLast(commandFilters)
      commandFilter.outputs = [idGenerate(topInput)]
      return commandFilters
    }

    private _overlayFilter?: Filter
    get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}

    scaleCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { time, containerRects, filterInput: input, videoRate } = args
      let filterInput = input
      assertPopulatedString(filterInput, 'filterInput')

      assertArray(containerRects, 'containerRects')
      const [rect, rectEnd] = containerRects
      assertRect(rect)
      assertRect(rectEnd)

      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      // console.log(this.constructor.name, "scaleCommandFilters", containerRects, duration)
      const commandFilters: CommandFilters = []
      
      const { scaleFilter } = this
      const filterCommandFilterArgs: FilterCommandFilterArgs = { 
        duration, videoRate, filterInput
      }
      scaleFilter.setValue(rect.width, 'width')
      scaleFilter.setValue(rect.height, 'height')
      scaleFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
      scaleFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)  
      commandFilters.push(...scaleFilter.commandFilters(filterCommandFilterArgs))
      return commandFilters
    }

    private _scaleFilter?: Filter
    get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}
     
    selectables(): Selectables { return [this, ...this.clip.selectables()] }

    selectType = SelectType.None

    selectedItems(actions: Actions): SelectedItems {
      const selectedItems: SelectedItems = []
      const { container, clip, selectType, definition } = this

      // add contentId or containerId from target, as if it were my property 
      const { id: undoValue } = definition 
      const { timing, sizing } = clip
      const dataType = container ? DataType.ContainerId : DataType.ContentId
      const property = clip.properties.find(property => property.type === dataType)
      assertProperty(property)
      
      const { name } = property
      const undoValues: ScalarObject = { timing, sizing, [name]: undoValue }
      const values: ScalarObject = { ...undoValues }
      const relevantTiming = container ? Timing.Container : Timing.Content
      const relevantSizing = container ? Sizing.Container : Sizing.Content
      const timingBound = timing === relevantTiming
      const sizingBound = sizing === relevantSizing 
     
      selectedItems.push({
        selectType, property, value: undoValue,
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(redoValue)

          const redoValues = { ...values, [name]: redoValue }
          if (timingBound || sizingBound) {

            const newDefinition = Defined.fromId(redoValue)
            const { type } = newDefinition
            if (timingBound && !isTimingDefinitionType(type)) {
              redoValues.timing = Timing.Custom
            }
            if (sizingBound && !isSizingDefinitionType(type)) {
              redoValues.sizing = container ? Sizing.Content : Sizing.Container
            }
          } 
          const actionObject = { 
            type: ActionType.ChangeMultiple, 
            property, target: clip, redoValues, undoValues 
          }
          actions.create(actionObject)
        },
      })

      // add my actual properties
      const { properties } = this
      const props = properties.filter(property => this.selectedProperty(property))

      props.forEach(property => {
        selectedItems.push(...this.selectedProperties(actions, property))
      })
      
      return selectedItems
    }

    selectedProperties(actions: Actions, property: Property): SelectedProperties {
      const properties: SelectedProperties = []
      const { name, tweenable, type: dataType } = property
      
      const { selectType } = this
      const undoValue = this.value(name)
      const target = this
      const type = dataType === DataType.Frame ? ActionType.ChangeFrame : ActionType.Change
      const selectedProperty: SelectedProperty = {
        selectType, property, value: undoValue, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
          actions.create({ type, property, target, redoValue, undoValue })
        }
      }
      // console.log(this.constructor.name, "selectedProperties", name)
      properties.push(selectedProperty)
      if (tweenable) {
        const tweenName = [name, PropertyTweenSuffix].join('')
        const target = this
        const undoValue = this.value(tweenName)
        const selectedPropertEnd: SelectedProperty = {
          selectType, property, value: undoValue, name: tweenName,
          changeHandler: (property: string, redoValue: Scalar) => {            
            actions.create({ property, target, redoValue, undoValue })
          }
        }
        // console.log(this.constructor.name, "selectedProperties", tweenName)
        properties.push(selectedPropertEnd)
      }
      return properties
    }

    selectedProperty(property: Property): boolean {
      const { name } = property
      switch(name) {
        case 'muted': return this.mutable()
        case 'opacity': return this.container
      }
      return true
    }

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

    tweenPoints(time: Time, range: TimeRange): PointTuple {
      const [x, xEndOrNot] = this.tweenValues('x', time, range)
      const [y, yEndOrNot] = this.tweenValues('y', time, range)
      assertNumber(x)
      assertNumber(y)
      const point: Point = { x, y } 
      const tweenPoint = { x: xEndOrNot, y: yEndOrNot }
      return [point, tweenOverPoint(point, tweenPoint)]
    }

    tweenRects(time: Time, range: TimeRange): RectTuple {
      const [size, sizeEnd] = this.tweenSizes(time, range)
      const [point, pointEnd] = this.tweenPoints(time, range)
      return [ { ...point , ...size }, { ...pointEnd , ...sizeEnd } ]
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

    tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
      const values: Scalar[] = []
      const isRange = isTimeRange(time)
      values.push(this.tween(key, isRange ? time.startTime : time, range))
      if (isRange) values.push(this.tween(key, time.endTime, range))
      return values
    }

    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
      const graphFileArgs: GraphFileArgs = { 
        ...args, audible: false, visible: true
      }
      const files = this.fileCommandFiles(graphFileArgs)
      // console.log(this.constructor.name, "visibleCommandFiles", files)
      return files
    }
  }
}
