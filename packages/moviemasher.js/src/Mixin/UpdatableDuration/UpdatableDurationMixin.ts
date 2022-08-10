import { AudibleSource, StartOptions, UnknownObject, ValueObject } from "../../declarations"
import { CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFilterArgs } from "../../MoveMe"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Default } from "../../Setup/Default"
import { LoadType } from "../../Setup/Enums"
import { assertPopulatedString, isPositive } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableDuration, UpdatableDurationClass, UpdatableDurationDefinition, UpdatableDurationObject } from "./UpdatableDuration"
import { filterFromId } from "../../Filter/FilterFactory"
import { Filter } from "../../Filter/Filter"
import { timeFromArgs } from "../../Helpers"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { idGenerate } from "../../Utility/Id"
import { Tweening } from "../../Utility/Tween"

const AudibleGainDelimiter = ','

export function UpdatableDurationMixin<T extends PreloadableClass>(Base: T): UpdatableDurationClass & T {
  return class extends Base implements UpdatableDuration {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { gain } = object as UpdatableDurationObject

      if (typeof gain !== "undefined") {
        if (typeof gain === "string") {
          if (gain.includes(AudibleGainDelimiter)) {
            const floats = gain.split(AudibleGainDelimiter).map(string => parseFloat(string))
            const z = floats.length / 2
            for (let i = 0; i < z; i += 1) {
              this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]])
            }
            this.gain = -1
          } else this.gain = Number(gain)
        } else this.gain = gain
      }
    }

    audibleSource(preloader: Loader): AudibleSource | undefined {
      return this.definition.audibleSource(preloader)
    }

    declare definition: UpdatableDurationDefinition

    definitionTime(masherTime: Time, clipRange: TimeRange): Time {
      const superTime = super.definitionTime(masherTime, clipRange)

      const { trim } = this
      const scaledTime = superTime.withFrame(superTime.frame + trim)

      if (this.speed === Default.instance.video.speed) return scaledTime
  
      return scaledTime.divide(this.speed) //, 'ceil')
    }

    gain = Default.instance.audio.gain

    gainPairs: number[][] = []


    graphFiles(args: GraphFileArgs): GraphFiles {
      const { editing, audible, time } = args
      if (!audible) return []

      if (editing && !time.isRange) return []

      if (!(this.mutable() && !this.muted)) return []

      const { definition } = this

      const file = definition.urlAudible(editing)
      // console.log(this.constructor.name, "graphFiles", editing, file)

      const options: ValueObject = {}
      const graphFile: GraphFile = {
        type: LoadType.Audio, file, 
        definition, input: true, options
      }
      return [graphFile]
    }
    
    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        time, quantize, commandFiles, clipTime, videoRate, duration 
      } = args
      
      let filterInput = commandFilesInput(commandFiles, this.id, true)
      assertPopulatedString(filterInput, 'filterInput')
    
      const trimFilter = 'trim' 
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueObject = {}
      if (duration) trimOptions.duration = duration
      const { frame } = this.definitionTime(time, clipTime)
      if (frame) trimOptions.start = timeFromArgs(frame, quantize).seconds

      const commandFilter: CommandFilter = { 
        inputs: [filterInput], 
        ffmpegFilter: trimFilter, 
        options: trimOptions, 
        outputs: [trimId]
      }
      commandFilters.push(commandFilter)
      filterInput = trimId
      if (duration) {
        const fpsFilter = 'fps'
        const fpsId = idGenerate(fpsFilter)
        const fpsCommandFilter: CommandFilter = { 
          ffmpegFilter: fpsFilter, 
          options: { fps: videoRate }, 
          inputs: [filterInput], outputs: [fpsId]
        }
        commandFilters.push(fpsCommandFilter)
        filterInput = fpsId
      } 
  
      const setptsFilter = 'setpts'
      const setptsId = idGenerate(setptsFilter)
      const setptsCommandFilter: CommandFilter = { 
        ffmpegFilter: setptsFilter, 
        options: { expr: 'PTS-STARTPTS' }, 
        inputs: [filterInput], outputs: [setptsId]
      }
      commandFilters.push(setptsCommandFilter) 
    
      return commandFilters
    }

    mutable() { 
      // console.log(this.constructor.name, "mutable", this.definition.audio )
      return this.definition.audio 
    }

    startOptions(seconds: number, timeRange: TimeRange): StartOptions {
      let offset = timeRange.withFrame(this.trim).seconds
      let start = timeRange.seconds - seconds
      let duration = timeRange.lengthSeconds

      if (start < 0) {
        offset -= start
        duration += start
        start = 0
      }
      return { start, offset, duration }
    }

    declare speed: number
    toJSON(): UnknownObject {
      const object = super.toJSON()
      if (this.speed !== Default.instance.video.speed) object.speed = this.speed
      if (this.gain !== Default.instance.audio.gain) object.gain = this.gain
      return object
    }

    declare trim: number

    private _trimFilter?: Filter
    get trimFilter() { return this._trimFilter ||= filterFromId('trim')}
    
  }
}
