import { AudibleSource, StartOptions, UnknownObject, ValueObject } from "../../declarations"
import { CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
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

    contentCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      
      const { filterInput: input, visible } = args
      let filterInput = input 
      
      assertPopulatedString(filterInput, 'filterInput')
      
      if (!visible) {
        commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
      } else commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }))

      return commandFilters
    }

    declare definition: UpdatableDurationDefinition

    definitionTime(quantize: number, time: Time): Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (this.speed === Default.instance.video.speed) return scaledTime

      return scaledTime.divide(this.speed) //, 'ceil')
    }

    gain = Default.instance.audio.gain

    gainPairs: number[][] = []


    graphFiles(args: GraphFileArgs): GraphFiles {
      const { editing, audible, time } = args
      if (!audible) return []

      if (editing && !time.isRange) return []

      const { definition } = this

      const options: ValueObject = {}
      const graphFile: GraphFile = {
        type: LoadType.Audio, file: definition.urlAudible, definition, input: true,
        options
      }
      return [graphFile]
    }
    
    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    initialCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { trim } = this
      const { time, quantize, visible, commandFiles, clipTime, videoRate } = args
      // console.log(this.constructor.name, "initialCommandFilters", commandFiles)
      const timeDuration = time.isRange ? time.lengthSeconds : 0
      const duration = timeDuration ? Math.min(timeDuration, clipTime!.lengthSeconds) : 0
      

      let filterInput = commandFilesInput(commandFiles, this.id, visible)
      assertPopulatedString(filterInput, 'filterInput')
    
      const trimFilter = visible ? 'trim' : 'atrim'
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueObject = {}
      if (duration) trimOptions.duration = duration
      if (trim) trimOptions.start = timeFromArgs(trim, quantize).seconds
      const commandFilter: CommandFilter = { 
        inputs: [filterInput], 
        ffmpegFilter: trimFilter, 
        options: trimOptions, 
        outputs: [trimId]
      }
      commandFilters.push(commandFilter)
      filterInput = trimId
      if (visible && duration) {
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
   
      if (visible) {
        const setptsFilter = 'setpts'
        const setptsId = idGenerate(setptsFilter)
        const setptsCommandFilter: CommandFilter = { 
          ffmpegFilter: setptsFilter, 
          options: { expr: 'PTS-STARTPTS' }, 
          inputs: [filterInput], outputs: [setptsId]
        }
        commandFilters.push(setptsCommandFilter) 
      } else {

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
        }

      }
      return commandFilters
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
