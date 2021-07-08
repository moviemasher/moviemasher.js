import { Time  } from "../../../Utilities/Time"
import { Is } from "../../../Utilities/Is"
import { TimeRange } from "../../../Utilities/TimeRange"
import { Any, Constrained, JsonObject } from "../../../Setup/declarations"
import { Clip } from "../Clip/Clip"
import { AudibleDefinition, AudibleObject } from "./Audible"
import { Default } from "../../../Setup"

const AudibleGainDelimiter = ','

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function AudibleMixin<TBase extends Constrained<Clip>>(Base: TBase) {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { gain, trim } = <AudibleObject> object

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
      // cnsole.log("AudibleMixin gain", typeof gain, gain, this.gain)

      if (typeof trim !== "undefined" && Is.integer(trim)) this.trim = trim
    }

    audible = true

    declare definition : AudibleDefinition

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (!Is.aboveZero(this.trim)) return scaledTime

      const trimTime = this.trimTime(quantize).scale(scaledTime.fps)
      return scaledTime.withFrame(scaledTime.frame + trimTime.frame)
    }

    gain = Default.instance.audio.gain

    gainPairs : number[][] = []

    get muted() : boolean {
      if (this.gain === 0) return true
      if (Is.positive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    maxFrames(quantize : number, trim? : number) : number {
      const space = trim ? trim : this.trim
      return Math.floor(this.definition.duration * quantize) - space
    }

    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.trim !== Default.instance.audio.trim) object.trim = this.trim
      if (this.gain !== Default.instance.audio.gain) object.gain = this.gain
      return object
    }

    trim = Default.instance.audio.trim

    trimTime(quantize : number) : Time { return Time.fromArgs(this.trim, quantize) }
  }
}

export { AudibleMixin }
