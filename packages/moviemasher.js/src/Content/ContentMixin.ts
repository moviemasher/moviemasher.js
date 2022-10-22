import { SvgFilters, SvgItem, UnknownObject, ValueObject } from "../declarations"
import { Rect, rectFromSize, RectTuple, RectZero } from "../Utility/Rect"

import { Errors } from "../Setup/Errors"
import { assertPopulatedString, assertPositive, isArray } from "../Utility/Is"
import { Content, ContentClass, ContentObject, ContentRectArgs } from "./Content"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { tweenCoverPoints, tweenCoverSizes, Tweening, tweenRectsLock } from "../Utility/Tween"
import { DataGroup, Property, propertyInstance } from "../Setup/Property"
import { ActionType, DataType, Orientation } from "../Setup/Enums"
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFileArgs, VisibleCommandFilterArgs } from "../MoveMe"
import { idGenerate } from "../Utility/Id"
import { commandFilesInput } from "../Utility/CommandFiles"
import { timeFromArgs } from "../Helpers/Time/TimeUtilities"
import { Actions } from "../Editor/Actions/Actions"
import { SelectedEffects, SelectedItems } from "../Utility/SelectedProperty"
import { Effect, Effects } from "../Media/Effect/Effect"
import { arrayLast } from "../Utility/Array"
import { effectInstance } from "../Media/Effect/EffectFactory"
import { Size, sizeAboveZero } from "../Utility/Size"
import { svgFilterElement, svgSet } from "../Utility/Svg"
import { isAudio } from "../Media/Audio/Audio"


export function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { isDefaultOrAudio, container } = this

      if (!(isDefaultOrAudio || container)) {
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
      }
    
      const { effects } = object as ContentObject

      if (effects) this.effects.push(...effects.map(effectObject => {
        const instance = effectInstance(effectObject)
        instance.tweenable = this
        return instance
      }))
    }


    audibleCommandFiles(args: CommandFileArgs): CommandFiles {
      const graphFileArgs: GraphFileArgs = { 
        ...args, audible: true, visible: false
      }
      return this.fileCommandFiles(graphFileArgs)
    }

    audibleCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { time, quantize, commandFiles, clipTime } = args
      // console.log(this.constructor.name, "initialCommandFilters", time, clipTime)
      const timeDuration = time.isRange ? time.lengthSeconds : 0
      const duration = timeDuration ? Math.min(timeDuration, clipTime!.lengthSeconds) : 0
      
      const { id } = this
      // console.log(this.constructor.name, "audibleCommandFilters calling commandFilesInput", id)
      let filterInput = commandFilesInput(commandFiles, id, false)
    
      const trimFilter = 'atrim'
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueObject = {}

      const { frame } = this.definitionTime(time, clipTime)

      if (duration) trimOptions.duration = duration
      if (frame) trimOptions.start = timeFromArgs(frame, quantize).seconds

      const commandFilter: CommandFilter = { 
        inputs: [filterInput], 
        ffmpegFilter: trimFilter, 
        options: trimOptions, 
        outputs: [trimId]
      }
      commandFilters.push(commandFilter)
      filterInput = trimId
      
      const delays = (clipTime!.seconds - time.seconds) * 1000
      if (delays) {
        const adelayFilter = 'adelay'
        const adelayId = idGenerate(adelayFilter)
        const adelayCommandFilter: CommandFilter = { 
          ffmpegFilter: adelayFilter, 
          options: { delays, all:1 }, 
          inputs: [filterInput], outputs: [adelayId]
        }
        commandFilters.push(adelayCommandFilter) 
        filterInput = adelayId
      }
      commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
      return commandFilters
    }


    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters { 
      // console.log(this.constructor.name, "contentCommandFilters returning empty")
      return this.effectsCommandFilters(args)
    }


    contentPreviewItemPromise(containerRect: Rect, time: Time, timeRange: TimeRange, icon?: boolean): Promise<SvgItem> {
      return this.itemPromise(containerRect, time, timeRange, icon)
    }

    contentRects(args: ContentRectArgs): RectTuple {
      const {containerRects: rects, time, timeRange, loading, editing } = args
      const tuple = isArray(rects) ? rects : [rects, rects] as RectTuple

      if (loading && !this.intrinsicsKnown({ editing, size: true })) {
        return tuple
      }
      const intrinsicRect = this.intrinsicRect(editing)
      if (!sizeAboveZero(intrinsicRect)) return tuple
      
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = tweenRectsLock(tweenRects, lock) 
      const coverSizes = tweenCoverSizes(intrinsicRect, rects, locked)
      const [size, sizeEnd] = coverSizes 
      const coverPoints = tweenCoverPoints(coverSizes, rects, locked)
      const [point, pointEnd] = coverPoints
      const rect = rectFromSize(size, point)
      const rectEnd = rectFromSize(sizeEnd, pointEnd)
      // console.log(this.constructor.name, "contentRects", lock, locked, isArray(rects) ? rects[0] : rects,  "->", rect)
      return [rect, rectEnd]
    }
    
    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const { effects, isDefaultOrAudio } = this
       if (isDefaultOrAudio || !effects.length) return 
      
      const svgFilters: SvgFilters = this.effects.flatMap(effect => 
        effect.svgFilters(outputSize, containerRect, time, clipTime)
      )
     
      // const size = sizeCopy(this.contentRect(containerRect, time, clipTime))
      
      const filter = svgFilterElement(svgFilters, contentItem)
      svgSet(filter, '200%', 'width')
      svgSet(filter, '200%', 'height')
      
      return filter
    }

    definitionIds(): string[] {
      return [
        ...super.definitionIds(),
        ...this.effects.flatMap(effect => effect.definitionIds()),
      ]
    }
    
    effectsCommandFilters(args: VisibleCommandFilterArgs): CommandFilters { 
      const commandFilters: CommandFilters = []
      const { filterInput: input } = args
      let filterInput = input
      assertPopulatedString(filterInput)

      const { effects, isDefaultOrAudio } = this
      if (isDefaultOrAudio) return commandFilters

      commandFilters.push(...effects.flatMap(effect => {
        const filters = effect.commandFilters({ ...args, filterInput })
        if (filters.length) filterInput = arrayLast(arrayLast(filters).outputs)
        return filters
      }))
      return commandFilters
    }
  
    effects: Effects = []
    
    intrinsicRect(_ = false): Rect { return RectZero }

    get isDefault() { 
      return this.definitionId === "com.moviemasher.content.default" 
    }

    get isDefaultOrAudio() {
      return this.isDefault || isAudio(this) 
    }

    itemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
      throw new Error(Errors.unimplemented) 
    }

    selectedItems(actions: Actions): SelectedItems {
      const selectedItems: SelectedItems = super.selectedItems(actions)
      if (this.isDefaultOrAudio || this.container) return selectedItems

      // add effects 
      const { effects, selectType } = this
  
      const undoEffects = [...effects]
      const effectable = this
      const selectedEffects: SelectedEffects = {
        selectType,
        value: this.effects, 
        removeHandler: (effect: Effect) => {
          const options = {
            redoSelection: { ...actions.selection, effect: undefined },
            effects,
            undoEffects,
            redoEffects: effects.filter(other => other !== effect),
            type: ActionType.MoveEffect
          }
          actions.create(options)
        },
        moveHandler: (effect: Effect, index = 0) => {
          assertPositive(index, 'index')
          
          const redoEffects = undoEffects.filter(e => e !== effect)
          const currentIndex = undoEffects.indexOf(effect)
          const insertIndex = currentIndex < index ? index - 1 : index
          redoEffects.splice(insertIndex, 0, effect)
          const options = {
            effects, undoEffects, redoEffects, type: ActionType.MoveEffect, 
            effectable
          }
          actions.create(options)
        },
        
        addHandler: (effect: Effect, insertIndex = 0) => {
          assertPositive(insertIndex, 'index')
          const redoEffects = [...effects]
          redoEffects.splice(insertIndex, 0, effect)
          effect.tweenable = this
          const options = {
            effects,
            undoEffects,
            redoEffects,
            redoSelection: { ...actions.selection, effect },
            type: ActionType.MoveEffect
          }
          actions.create(options)
        },
      }
      selectedItems.push(selectedEffects)
      return selectedItems
    }
    
    selectedProperty(property: Property): boolean {
      const { name } = property
      switch(name) {
        case 'effects': // return !(this.container || this.isDefaultOrAudio)
        case 'lock': //return this.container && !isAudio(this)
        case 'width':
        case 'height':
        case 'x':
        case 'y': return !(this.isDefaultOrAudio) 
      }
      return super.selectedProperty(property)
    }

    toJSON(): UnknownObject {
      const json = super.toJSON()
      json.effects = this.effects
      return json
    }
  }
}
 