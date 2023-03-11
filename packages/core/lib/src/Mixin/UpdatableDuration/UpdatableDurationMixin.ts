import { Numbers, Scalar, UnknownRecord, ValueRecord } from "../../Types/Core"
import { StartOptions } from "../../Plugin/Masher/Preview/AudioPreview/AudioPreview"
import { CommandFilter, CommandFilters, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFilterArgs } from "../../Base/Code"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { assertAboveZero, assertPopulatedString, isAboveZero, isDefined, isPositive, isString } from "../../Utility/Is"
import { UpdatableDuration, UpdatableDurationClass, UpdatableDurationDefinition, UpdatableDurationObject } from "./UpdatableDuration"
import { filterFromId } from "../../Plugin/Filter/FilterFactory"
import { Filter } from "../../Plugin/Filter/Filter"
import { timeFromArgs, timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { idGenerate } from "../../Utility/Id"
import { Tweening } from "../../Utility/Tween"
import { Property } from "../../Setup/Property"
import { IntrinsicOptions } from "../../Media/Mash/Track/Clip/Clip"
import { AudioType } from "../../Setup/Enums"
import { ContentClass } from "../../Media/Content/Content"
import { arrayOfNumbers } from "../../Utility/Array"
import { CommaChar } from "../../Setup/Constants"


export function UpdatableDurationMixin<T extends ContentClass>(Base: T): UpdatableDurationClass & T {
  return class extends Base implements UpdatableDuration {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { gain } = object as UpdatableDurationObject

      if (isDefined(gain)) {
        if (isString(gain)) {
          if (gain.includes(CommaChar)) {
            const floats = gain.split(CommaChar).map(string => parseFloat(string))
            const z = floats.length / 2
            arrayOfNumbers(z).forEach(i => {
              this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]])
            })
            this.gain = -1
          } else this.gain = Number(gain)
        } else if (isPositive(gain)) this.gain = gain
      }
    }
    
    declare definition: UpdatableDurationDefinition

    definitionTime(mashTime: Time, clipRange: TimeRange): Time {
      const superTime = super.definitionTime(mashTime, clipRange)
      const { startTrim, endTrim, definition } = this
      const { duration } = definition
      assertAboveZero(duration)

      const durationTime = timeFromSeconds(duration, clipRange.fps)
      const durationFrames = durationTime.frame - (startTrim + endTrim)
      const offset = superTime.frame % durationFrames
      return superTime.withFrame(offset + startTrim).divide(this.speed) 
    }

    frames(quantize: number): number {
      const { definition, startTrim, endTrim } = this
      const frames = definition.frames(quantize)
      return frames - (startTrim + endTrim)
    }

    gain = 1.0

    gainPairs: Numbers[] = []

    graphFiles(args: PreloadArgs): GraphFiles {
      const { audible } = args
      if (!audible) return []
      if (!(this.mutable() && !this.muted)) return []

      const { definition } = this
      const graphFile: GraphFile = {
        type: AudioType, file: '', definition, input: true
      }
      return [graphFile]
    }
    
    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      if (this.gainPairs.length !== 2) return false

      const [first, second] = this.gainPairs
      if (first.length !== 2) return false
      if (second.length !== 2) return false
      if (Math.max(...first)) return false
      const [time, value] = second
      return time === 1 && value === 0
    }

    hasIntrinsicTiming = true
    
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        time, quantize, commandFiles, clipTime, videoRate, duration 
      } = args

      const { id } = this
      // console.log(this.constructor.name, "initialCommandFilters calling commandFilesInput", id)
      let filterInput = commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'filterInput')
    
      const trimFilter = 'trim' 
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueRecord = {}
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

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true
      
      return isAboveZero(this.definition.duration)
    }

    mutable() { return this.definition.audio }
  
    selectedProperty(property: Property): boolean {
      const { name } = property
      switch(name) {
        case 'gain': return this.mutable() && !this.muted 
      }
      return super.selectedProperty(property)
    }

    setValue(value: Scalar, name: string, property?: Property | undefined): void {
      super.setValue(value, name, property)
      if (property) return

      switch (name) {
        case 'startTrim':
        case 'endTrim':
        case 'speed':
          // console.log(this.constructor.name, "setValue", name, value)
            
          this.clip.resetTiming(this)
          break
      
      }
    }

    startOptions(seconds: number, timeRange: TimeRange): StartOptions {
      let offset = timeRange.withFrame(this.startTrim).seconds
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

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      const { speed, gain } = this
      if (speed !== 1.0) json.speed = speed
      if (gain !== 1.0) json.gain = gain
      return json
    }

    declare startTrim: number
    declare endTrim: number

    private _trimFilter?: Filter
    get trimFilter() { return this._trimFilter ||= filterFromId('trim')}
    
  }
}
