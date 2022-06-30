import { AudibleContextInstance } from "../../Context/AudibleContext"
import { AudibleSource, LoadedAudio } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { Loader } from "../../Loader/Loader"
import { DataType, LoadType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isAboveZero } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject } from "./UpdatableDuration"

export function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { url, source, loop, duration, waveform } = object as UpdatableDurationDefinitionObject

      if (waveform) this.waveform = waveform
      if (isAboveZero(duration)) this.duration
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
      this.properties.push(propertyInstance({ name: "muted", type: DataType.Boolean }))
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

    duration = 0

    frames(quantize: number): number {
      if (!this.duration) return 0

      return timeFromSeconds(this.duration, quantize, 'floor').frame
    }


    graphFiles(args: GraphFileArgs): GraphFiles {
      const { editing, audible, time } = args
      if (!audible) return []

      if (editing && !time.isRange) return []

      const graphFile: GraphFile = {
        type: LoadType.Audio, file: this.urlAudible, definition: this, input: true,
      }
      return [graphFile]
    }

    loop = false

    urlAudible: string


    waveform?: string


  }
}
