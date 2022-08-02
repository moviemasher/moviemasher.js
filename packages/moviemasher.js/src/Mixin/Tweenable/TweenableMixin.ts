import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Scalar, UnknownObject } from "../../declarations"
import { Filter } from "../../Filter/Filter"
import { filterFromId } from "../../Filter/FilterFactory"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { SelectedEffects, SelectedItems, SelectedProperties, SelectedProperty } from "../../Utility/SelectedProperty"
import { Point, PointTuple } from "../../Utility/Point"
import { assertRect, Rect, RectTuple } from "../../Utility/Rect"
import { ActionType, DataType, Orientation } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertProperty, DataGroup, Property, propertyInstance } from "../../Setup/Property"
import { arrayLast } from "../../Utility/Array"
import { colorBlackOpaque, colorName, colorWhite } from "../../Utility/Color"
import { idGenerate } from "../../Utility/Id"
import { assertAboveZero, assertArray, assertNumber, assertPopulatedString, assertPositive, assertTrue, isNumber, isPopulatedArray, isTimeRange, isUndefined } from "../../Utility/Is"
import { assertSize, Size, SizeTuple } from "../../Utility/Size"
import { tweenColorStep, tweenNumberStep, tweenOverPoint, tweenOverSize } from "../../Utility/Tween"
import { Tweenable, TweenableClass, TweenableDefinition, TweenableObject } from "./Tweenable"
import { Actions } from "../../Editor/Actions/Actions"
import { Clip } from "../../Media/Clip/Clip"
import { Effect, Effects } from "../../Media/Effect/Effect"
import { effectInstance } from "../../Media/Effect/EffectFactory"

export function TweenableMixin<T extends InstanceClass>(Base: T): TweenableClass & T {
  return class extends Base implements Tweenable {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { effects } = object as TweenableObject
      if (effects) this.effects.push(...effects.map(effectObject => {
        const effect = effectInstance(effectObject)
        return effect
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

    _clip?: Clip
    get clip() { return this._clip! }
    set clip(value: Clip) { this._clip = value }

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
   
    container = false

    containerColorCommandFilters(args: CommandFilterArgs): CommandFilters { 
      return this.colorCommandFilters(args)
    }

    containerCommandFilters(args: CommandFilterArgs): CommandFilters { 
      // console.log(this.constructor.name, "containerCommandFilters returning empty")
      return [] 
    }

    contentCommandFilters(args: CommandFilterArgs): CommandFilters { 
      // console.log(this.constructor.name, "contentCommandFilters returning empty")
      return this.effectsCommandFilters(args)
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

    definitionIds(): string[] {
      return [
        ...super.definitionIds(),
        ...this.effects.flatMap(effect => effect.definitionIds()),
      ]
    }
    
    effects: Effects = []
  
    containerFinalCommandFilters(args: CommandFilterArgs): CommandFilters { 
      return []
    }

    effectsCommandFilters(args: CommandFilterArgs): CommandFilters { 
      const commandFilters: CommandFilters = []
      const { filterInput: input } = args
      let filterInput = input
      assertPopulatedString(filterInput)

      const { effects } = this
      commandFilters.push(...effects.flatMap(effect => {
        const filters = effect.commandFilters({ ...args, filterInput })
        if (filters.length) filterInput = arrayLast(arrayLast(filters).outputs)
        return filters
      }))
      return commandFilters
    }

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }

    initialCommandFilters(args: CommandFilterArgs): CommandFilters {
      throw new Error(Errors.unimplemented)
    }
    
    intrinsicRect(editing = false): Rect { 
      throw new Error(Errors.unimplemented) 
    }

    intrinsicsKnown(editing = false): boolean { return true }

    get isDefault() { return false }

    declare lock: Orientation

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

    mutable() { return false }
    
    declare muted: boolean 
    
    declare offE: boolean
    declare offN: boolean
    declare offS: boolean
    declare offW: boolean

    private _overlayFilter?: Filter
    get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}

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
      
      const { scaleFilter } = this
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
     
    selectedItems(actions: Actions): SelectedItems {
      const selectedItems: SelectedItems = []
      const { container, clip: target, effects, selectType } = this

      // add contentId or containerId from target, as if it were my property  
      const dataType = container ? DataType.ContainerId : DataType.ContentId
      const property = target.properties.find(property => property.type === dataType)
      assertProperty(property)

      const value = this.definitionId
      selectedItems.push({
        selectType, property, value,
        changeHandler: (property: string, value: Scalar) => {
          const undoValue = this.value(property)
          const redoValue = isUndefined(value) ? undoValue : value
          actions.create({ property, target, redoValue, undoValue })
        },
      })


      // add my actual properties
      this.properties.forEach(property => {
        selectedItems.push(...this.selectedProperties(actions, property))
      })

      // add effects 
      const { selection } = actions
      const undoEffects = [...effects]
      const selectedEffects: SelectedEffects = {
        selectType,
        value: this.effects, 
        removeHandler: (effect: Effect) => {
          const options = {
            redoSelection: { ...selection, effect: undefined },
            effects,
            undoEffects,
            redoEffects: effects.filter(other => other !== effect),
            type: ActionType.MoveEffect
          }
          actions.create(options)
        },
        moveHandler: (effect: Effect, index = 0) => {
          // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
          assertPositive(index, 'index')
          
          const redoEffects = undoEffects.filter(e => e !== effect)
          const currentIndex = undoEffects.indexOf(effect)
          const insertIndex = currentIndex < index ? index - 1 : index
          redoEffects.splice(insertIndex, 0, effect)
          const options = {
            effects, undoEffects, redoEffects, type: ActionType.MoveEffect, 
            effectable: this
          }
          actions.create(options)
        },
        
        addHandler: (effect: Effect, insertIndex = 0) => {
          assertPositive(insertIndex, 'index')
          const redoEffects = [...effects]
          redoEffects.splice(insertIndex, 0, effect)
          const options = {
            effects,
            undoEffects,
            redoEffects,
            redoSelection: { ...selection, effect },
            type: ActionType.MoveEffect
          }
          actions.create(options)
        },
      }
      selectedItems.push(selectedEffects)
      return selectedItems
    }

    selectedProperties(actions: Actions, property: Property): SelectedProperties {
      const selectedProperties: SelectedProperties = []
      const { name, tweenable } = property
      const { clip, selectType } = this
      const timeRange = clip.timeRange(actions.editor.edited!.quantize)

      const selectedProperty: SelectedProperty = {
        selectType, property, value: this.value(name), 
        changeHandler: (property: string, value: Scalar) => {
          const undoValue = this.value(property)
          const redoValue = isUndefined(value) ? undoValue : value
          actions.create({ property, target: this, redoValue, undoValue })
        }
      }
      if (tweenable) selectedProperty.time = timeRange.startTime
      selectedProperties.push(selectedProperty)
      if (tweenable) {
        const tweenName = [name, PropertyTweenSuffix].join('')
        const selectedPropertEnd: SelectedProperty = {
          selectType, property, value: this.value(tweenName), name: tweenName,
          time: timeRange.lastTime,
          changeHandler: (property: string, value: Scalar) => {
            const undoValue = this.value(property)
            const redoValue = isUndefined(value) ? undoValue : value
            actions.create({ property, target: this, redoValue, undoValue })
          }
        }
        selectedProperties.push(selectedPropertEnd)
      }

      return selectedProperties
    }
    
    private _setsarFilter?: Filter
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar') }

    _setptsFilter?: Filter
    get setptsFilter() { return this._setptsFilter ||= filterFromId('setpts')}

    toJSON(): UnknownObject {
      const json = super.toJSON()
      json.effects = this.effects
      return json
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
  }
}
