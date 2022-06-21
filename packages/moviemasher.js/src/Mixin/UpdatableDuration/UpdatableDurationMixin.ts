import { AudibleSource, StartOptions, UnknownObject } from "../../declarations"
import { GraphFile } from "../../MoveMe"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Default } from "../../Setup/Default"
import { LoadType } from "../../Setup/Enums"
import { assertPopulatedString, isPositive } from "../../Utility/Is"
import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableDuration, UpdatableDurationClass, UpdatableDurationDefinition, UpdatableDurationObject } from "./UpdatableDuration"

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

    definitionTime(quantize: number, time: Time): Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (this.speed === Default.instance.video.speed) return scaledTime

      return scaledTime.divide(this.speed) //, 'ceil')
    }


    gain = Default.instance.audio.gain

    gainPairs: number[][] = []

    graphFile(editing: boolean): GraphFile {
      const { definition } = this
      const file = definition.urlAudible //preloadableSource(editing) // urlAudible
      assertPopulatedString(file, editing ? 'url' : 'source')

      const graphFile: GraphFile = {
        localId: 'audio',
        input: true, options: {}, type: LoadType.Audio, file, definition
      }
      return graphFile
    }

    // declare muted: boolean

    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    startOptions(seconds: number, timeRange: TimeRange): StartOptions {
      let offset = 0
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
  }
}
