import { UnknownRecord, ValueRecord } from '../../Types/Core.js'
import { SvgFilters, SvgItem } from '../../Helpers/Svg/Svg.js'
import { Rect, rectFromSize, RectTuple, RectZero } from '../../Utility/Rect.js'

import { assertPopulatedString, isArray } from '../../Utility/Is.js'
import { Content, ContentClass, ContentObject, ContentRectArgs } from './Content.js'
import { DefaultContentId } from './ContentConstants.js'
import { TweenableClass } from '../../Mixin/Tweenable/Tweenable.js'
import { Time, TimeRange } from '../../Helpers/Time/Time.js'
import { tweenCoverPoints, tweenCoverSizes, Tweening, tweenRectsLock } from '../../Mixin/Tweenable/Tween.js'
import { DataGroup, Property, propertyInstance } from '../../Setup/Property.js'
import { DataType, Orientation } from '../../Setup/Enums.js'
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, Component, PreloadArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../../Base/Code.js'
import { idGenerate } from '../../Utility/Id.js'
import { commandFilesInput } from '../../Utility/CommandFiles.js'
import { timeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { Actions } from '../../Plugin/Masher/Actions/Actions.js'
import { SelectedItems, SelectedMovable } from '../../Helpers/Select/SelectedProperty.js'
import { Effects } from '../Effect/Effect.js'
import { arrayLast } from '../../Utility/Array.js'
import { effectInstance } from '../Effect/EffectFactory.js'
import { Size, sizeAboveZero } from '../../Utility/Size.js'
import { svgFilterElement, svgSet } from '../../Helpers/Svg/SvgFunctions.js'
import { isAudio } from '../Audio/Audio.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'


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
      if (effects) this.effects.push(...effects.map(effectInstance))
    }


    audibleCommandFiles(args: CommandFileArgs): CommandFiles {
      const graphFileArgs: PreloadArgs = { 
        ...args, audible: true, visible: false
      }
      return this.fileCommandFiles(graphFileArgs)
    }

    audibleCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { time, quantize, commandFiles, clipTime } = args
      // console.log(this.constructor.name, 'initialCommandFilters', time, clipTime)
      const timeDuration = time.isRange ? time.lengthSeconds : 0
      const duration = timeDuration ? Math.min(timeDuration, clipTime!.lengthSeconds) : 0
      
      const { id } = this
      // console.log(this.constructor.name, 'audibleCommandFilters calling commandFilesInput', id)
      let filterInput = commandFilesInput(commandFiles, id, false)
    
      const trimFilter = 'atrim'
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueRecord = {}

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
      // console.log(this.constructor.name, 'contentCommandFilters returning empty')
      return this.effectsCommandFilters(args)
    }


    contentPreviewItemPromise(containerRect: Rect, time: Time, timeRange: TimeRange, component: Component): Promise<SvgItem> {
      return this.contentSvgItemPromise(containerRect, time, timeRange, component)
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
      // console.log(this.constructor.name, 'contentRects', lock, locked, isArray(rects) ? rects[0] : rects,  '->', rect)
      return [rect, rectEnd]
    }
    
    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const { effects, isDefaultOrAudio } = this
       if (isDefaultOrAudio || !effects.length) return 
      
      const filters: SvgFilters = this.effects.flatMap(effect => 
        effect.svgFilters(outputSize, containerRect, time, clipTime)
      )
     
      // const size = sizeCopy(this.contentRect(containerRect, time, clipTime))
      
      const filter = svgFilterElement(filters, contentItem)
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


    effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
      const { container } = this
      const files: CommandFiles = []
      if (!container) {
        files.push(...this.effects.flatMap(effect => effect.commandFiles(args)))
      }
      return files
    }

    private effectsCommandFilters(args: VisibleCommandFilterArgs): CommandFilters { 
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

    get isDefault() { return this.mediaId === DefaultContentId }

    get isDefaultOrAudio() { return this.isDefault || isAudio(this) }

    contentSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
      return errorThrow(ErrorName.Unimplemented)
    }

    selectedItems(actions: Actions): SelectedItems {
      const selectedItems: SelectedItems = super.selectedItems(actions)
      if (this.isDefaultOrAudio || this.container) return selectedItems

      // add effects 
      const { effects, selectType } = this
      const { editor } = actions
 
      const selectedEffects: SelectedMovable = {
        name: 'effects',
        selectType,
        value: effects, 
        removeHandler: editor.removeEffect.bind(editor),
        moveHandler: editor.moveEffect.bind(editor),
        addHandler: editor.addEffect.bind(editor),
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

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      json.effects = this.effects
      return json
    }

    visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
      const commandFiles = super.visibleCommandFiles(args)
      commandFiles.push(...this.effectsCommandFiles(args))
      return commandFiles
    }
  }
}
 