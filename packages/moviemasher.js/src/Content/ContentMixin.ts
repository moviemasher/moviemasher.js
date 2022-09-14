import { SvgItem, ValueObject } from "../declarations"
import { Rect, rectFromSize, RectTuple, RectZero } from "../Utility/Rect"

import { Errors } from "../Setup/Errors"
import { assertPopulatedString, isArray } from "../Utility/Is"
import { Content, ContentClass, ContentRectArgs } from "./Content"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { tweenCoverPoints, tweenCoverSizes, tweenRectsLock } from "../Utility/Tween"
import { DataGroup, Property, propertyInstance } from "../Setup/Property"
import { DataType, DefinitionType } from "../Setup/Enums"
import { SelectedProperties } from "../Utility/SelectedProperty"
import { Actions } from "../Editor/Actions/Actions"
import { CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFileArgs } from "../MoveMe"
import { idGenerate } from "../Utility/Id"
import { commandFilesInput } from "../Utility/CommandFiles"
import { timeFromArgs } from "../Helpers/Time/TimeUtilities"

const ContentMixinKeys = ['lock', 'width', 'height', 'x', 'y']

export function ContentMixin<T extends TweenableClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { isDefaultOrAudio } = this
      if (!isDefaultOrAudio) {
        this.addProperties(object, propertyInstance({
          name: 'x', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        this.addProperties(object, propertyInstance({
          name: 'y', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        
      }
    }

    audibleCommandFiles(args: CommandFileArgs): CommandFiles {
      const { clipTime } = args
      const graphFileArgs: GraphFileArgs = { 
        ...args, audible: true, clipTime 
      }
      return this.graphCommandFiles(graphFileArgs)
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

    contentRects(args: ContentRectArgs): RectTuple {
      const {containerRects: rects, time, timeRange, loading, editing } = args
      if (loading && !this.intrinsicsKnown({ editing, size: true })) {
        return isArray(rects) ? rects : [rects, rects]
      }
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = tweenRectsLock(tweenRects, lock) 
      const intrinsicRect = this.intrinsicRect(editing)
      const coverSizes = tweenCoverSizes(intrinsicRect, rects, locked)
      const [size, sizeEnd] = coverSizes 
      const coverPoints = tweenCoverPoints(coverSizes, rects, locked)
      const [point, pointEnd] = coverPoints
      return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)]
    }

    contentRect(containerRect: Rect, time: Time, timeRange: TimeRange): Rect {
      const contentArgs: ContentRectArgs = {
        containerRects: containerRect, time, timeRange, editing: true
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect    
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }

    contentPreviewItemPromise(containerRect: Rect, time: Time, timeRange: TimeRange, icon?: boolean): Promise<SvgItem> {
      return this.itemPromise(containerRect, time, timeRange, true, icon)
    }
    

    intrinsicRect(_ = false): Rect { return RectZero }

    get isDefault() { 
      return this.definitionId === "com.moviemasher.content.default" 
    }

    get isDefaultOrAudio() {
      return this.isDefault || this.type === DefinitionType.Audio
    }
    
    selectedProperties(actions: Actions, property: Property): SelectedProperties {
      const { isDefaultOrAudio } = this
      if (isDefaultOrAudio && ContentMixinKeys.includes(property.name)) return []

      return super.selectedProperties(actions, property)
    }

    itemPromise(containerRect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem> {
      throw new Error(Errors.unimplemented) 
    }
  }
}
 