import { AudibleSource, LoadedAudio, Scalar, StartOptions, UnknownObject, ValueObject } from "../../declarations"
import { CommandFilter, CommandFilters, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFilterArgs } from "../../MoveMe"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Default } from "../../Setup/Default"
import { LoadType } from "../../Setup/Enums"
import { assertPopulatedString, assertTrue, isDefined, isPositive, isString } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableDuration, UpdatableDurationClass, UpdatableDurationDefinition, UpdatableDurationObject } from "./UpdatableDuration"
import { filterFromId } from "../../Filter/FilterFactory"
import { Filter } from "../../Filter/Filter"
import { timeFromArgs, timeFromSeconds, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { idGenerate } from "../../Utility/Id"
import { Tweening } from "../../Utility/Tween"
import { Property } from "../../Setup"
import { Actions } from "../../Editor/Actions/Actions"
import { SelectedProperties } from "../../Utility/SelectedProperty"

const AudibleGainDelimiter = ','


export function UpdatableDurationMixin<T extends PreloadableClass>(Base: T): UpdatableDurationClass & T {
  return class extends Base implements UpdatableDuration {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { gain } = object as UpdatableDurationObject

      if (isDefined(gain)) {
        if (isString(gain)) {
          if (gain.includes(AudibleGainDelimiter)) {
            const floats = gain.split(AudibleGainDelimiter).map(string => parseFloat(string))
            const z = floats.length / 2
            for (let i = 0; i < z; i += 1) {
              this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]])
            }
            this.gain = -1
          } else this.gain = Number(gain)
        } else if (isPositive(gain)) this.gain = gain
      }
    }

    audibleSource(preloader: Loader): AudibleSource | undefined {
      return this.definition.audibleSource(preloader)
    }

    declare definition: UpdatableDurationDefinition

    definitionTime(masherTime: Time, clipRange: TimeRange): Time {
      const superTime = super.definitionTime(masherTime, clipRange)
      const { startTrim, endTrim, definition } = this
      const { duration } = definition
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

    private get loadedAudio(): LoadedAudio {
      const { clip } = this
      const clipTime = timeRangeFromArgs()
      const args: GraphFileArgs = {
        time: clipTime, clipTime, 
        audible: true, quantize: 0, editing: true
      }
      const [graphFile] = this.graphFiles(args)
      const element: LoadedAudio = clip.track.mash.preloader.getFile(graphFile)
      assertTrue(!!element, "audio")
  
      return element
    }


    mutable() { 
      // console.log(this.constructor.name, "mutable", this.definition.audio )
      return this.definition.audio 
    }


    
    selectedProperties(actions: Actions, property: Property): SelectedProperties {
      const { name } = property
      switch(name) {
        case 'gain':
        case 'muted': {
          const mutable = this.mutable()
          if (!mutable || (this.muted && name === 'gain')) return []
        } 
      }
      return super.selectedProperties(actions, property)
    }

    setValue(value: Scalar, name: string, property?: Property | undefined): void {
      super.setValue(value, name, property)
      if (!this.clipped) return

      switch (name) {
        case 'startTrim':
        case 'endTrim':
        case 'speed':
          console.log(this.constructor.name, "setValue", name, value)
            
          this.clip.resetDuration(this)
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

    toJSON(): UnknownObject {
      const object = super.toJSON()
      if (this.speed !== 1.0) object.speed = this.speed
      if (this.gain !== 1.0) object.gain = this.gain
      return object
    }

    declare startTrim: number
    declare endTrim: number

    private _trimFilter?: Filter
    get trimFilter() { return this._trimFilter ||= filterFromId('trim')}
    
  }
}
