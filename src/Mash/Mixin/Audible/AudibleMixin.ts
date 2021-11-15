import { Is } from "../../../Utilities/Is"
import { Any, AudibleSource, JsonObject, StartOptions } from "../../../declarations"
import { ClipClass } from "../Clip/Clip"
import { AudibleClass, AudibleDefinition, AudibleObject } from "./Audible"
import { Default } from "../../../Setup/Default"
import { Cache } from "../../../Loading/Cache"
import { Time } from "../../../Utilities/Time"

const AudibleGainDelimiter = ','

function AudibleMixin<T extends ClipClass>(Base: T) : AudibleClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { gain } = <AudibleObject> object

      if (typeof gain !== "undefined") {
        if (typeof gain === "string") {
          if (gain.includes(AudibleGainDelimiter)){
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

    audible = true

    declare definition : AudibleDefinition

    gain = Default.instance.audio.gain

    gainPairs : number[][] = []


    loadedAudible():AudibleSource | undefined {
      return this.definition.loadedAudible()
    }

    get muted() : boolean {
      if (this.gain === 0) return true
      if (Is.positive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    startOptions(seconds: number, quantize: number): StartOptions {
        const range = this.timeRange(quantize)

        let start = seconds + range.seconds
        let duration = range.lengthSeconds

        const now = Cache.audibleContext.currentTime
        if (now > start) {
          const dif = now - start
          start = now
          duration -= dif
        }
        return { start, duration }
    }

    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.gain !== Default.instance.audio.gain) object.gain = this.gain
      return object
    }
  }
}

export { AudibleMixin }
