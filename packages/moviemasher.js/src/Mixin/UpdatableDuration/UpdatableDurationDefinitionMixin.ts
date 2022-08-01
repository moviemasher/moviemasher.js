import { AudibleContextInstance } from "../../Context/AudibleContext"
import { AudibleSource, LoadedAudio, UnknownObject, ValueObject } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { Loader } from "../../Loader/Loader"
import { DataType, Duration, LoadType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isAboveZero } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject } from "./UpdatableDuration"

export function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { audio, url, source, loop, duration, waveform } = object as UpdatableDurationDefinitionObject

      if (audio) this.audio = true
      if (waveform) this.waveform = waveform
      if (isAboveZero(duration)) this.duration = duration
      // console.log(this.constructor.name, "duration", duration, this.duration)
      if (loop) {
        this.loop = loop
        this.properties.push(propertyInstance({ name: 'loops', defaultValue: 1 }))
      }

      const urlAudible = url || source || ""
      assertPopulatedString(urlAudible)

      this.urlAudible = urlAudible
      this.properties.push(propertyInstance({ name: "gain", defaultValue: 1.0 }))
      this.properties.push(propertyInstance({ name: "speed", defaultValue: 1.0 }))
      this.properties.push(propertyInstance({ name: "trim", defaultValue: 0, type: DataType.Frame }))
    }

    audibleSource(preloader: Loader): AudibleSource | undefined {
      const graphFile: GraphFile = {
        file: this.urlAudible, type: LoadType.Audio, definition: this, input: true
      }
      if (!preloader.loadedFile(graphFile)) return
      const cached: LoadedAudio = preloader.getFile(graphFile)
      if (!cached) return

      return AudibleContextInstance.createBufferSource(cached)
    }

    audio = false

    duration = 0

    frames(quantize: number): number {
      const { duration } = this
      // console.log(this.constructor.name, "frames duration =", duration)
      if (!duration) return Duration.Unknown

      return timeFromSeconds(this.duration, quantize, 'floor').frame
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


    urlAudible: string
    
    waveform?: string
  }
}
