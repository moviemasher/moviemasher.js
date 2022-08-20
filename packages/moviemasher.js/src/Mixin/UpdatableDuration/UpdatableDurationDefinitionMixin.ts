import { AudibleContextInstance } from "../../Context/AudibleContext"
import { AudibleSource, LoadedAudio, UnknownObject } from "../../declarations"
import { GraphFile } from "../../MoveMe"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { Loader } from "../../Loader/Loader"
import { DataType, Duration, LoadType } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { isAboveZero, isPopulatedString } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject } from "./UpdatableDuration"

export function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { audioUrl, audio, loop, duration, waveform } = object as UpdatableDurationDefinitionObject
      if (audio) {
        this.audio = true
        // console.log(this.constructor.name, "audio", audio, this.audio)
      }
      if (isPopulatedString(audioUrl)) this.audioUrl = audioUrl
      if (waveform) this.waveform = waveform
      if (isAboveZero(duration)) this.duration = duration
      // console.log(this.constructor.name, "duration", duration, this.duration)
      if (loop) {
        this.loop = loop
        this.properties.push(propertyInstance({ name: 'loops', defaultValue: 1 }))
      }
      // group: DataGroup.Timing, 
      this.properties.push(propertyInstance({ 
        name: "gain", defaultValue: 1.0, type: DataType.Percent, 
        min: 0, max: 2.0, step: 0.01 
      }))
      this.properties.push(propertyInstance({ 
        name: "speed", defaultValue: 1.0, type: DataType.Percent, 
        min: 0.1, max: 2.0, step: 0.1,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: "startTrim", defaultValue: 0, type: DataType.Frame,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: "endTrim", defaultValue: 0, type: DataType.Frame,
        group: DataGroup.Timing,
      }))
    }

    audibleSource(preloader: Loader): AudibleSource | undefined {
      const graphFile = this.graphFile(true)
      const loaded = preloader.loadedFile(graphFile)
      // console.log(this.constructor.name, "audibleSource", file, loaded)
      if (!loaded) return

      const cached: LoadedAudio = preloader.getFile(graphFile)
      if (!cached) return

      return AudibleContextInstance.createBufferSource(cached)
    }

    audio = false

    audioUrl = ''

    duration = 0

    frames(quantize: number): number {
      const { duration } = this
      // console.log(this.constructor.name, "frames duration =", duration)
      if (!duration) return Duration.Unknown

      return  timeFromSeconds(this.duration, quantize, 'floor').frame
    }

    graphFile(editing?: boolean): GraphFile {
      const file = this.urlAudible(editing)
      const { loadType } = this
      const type = loadType === LoadType.Video ? loadType : LoadType.Audio
      const graphFile: GraphFile = { file, type, definition: this, input: true }
      return graphFile
    }

    loop = false

    toJSON() : UnknownObject {
      const json = super.toJSON()
      const { duration, audio, loop, waveform } = this
      if (duration) json.duration = this.duration
      if (audio) json.audio = this.audio
      if (loop) json.loop = this.loop
      if (waveform) json.waveform = this.waveform
      return json
    }

    urlAudible(editing = false): string { 
      // console.log(this.constructor.name, "urlAudible", editing, this.audioUrl)
      if (editing) return this.audioUrl || this.url

      return this.source
    }
    
    waveform?: string
  }
}
