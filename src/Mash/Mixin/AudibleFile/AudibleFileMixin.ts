import { Any, JsonObject, StartOptions } from "../../../declarations"
import { Default } from "../../../Setup/Default"
import { Is } from "../../../Utilities/Is"
import { Time } from "../../../Utilities/Time"
import { AudibleClass } from "../Audible/Audible"
import { AudibleFileClass, AudibleFileDefinition, AudibleFileObject } from "./AudibleFile"

import { Cache } from "../../../Loading/Cache"

function AudibleFileMixin<T extends AudibleClass>(Base: T): AudibleFileClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      const { loop, trim } = <AudibleFileObject>object

      if (typeof trim !== "undefined" && Is.integer(trim)) this.trim = trim
      if (typeof loop !== "undefined" && Is.integer(loop)) this.loop = loop
    }

    declare definition : AudibleFileDefinition

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (!Is.aboveZero(this.trim)) return scaledTime

      const trimTime = this.trimTime(quantize).scale(scaledTime.fps)
      return scaledTime.withFrame(scaledTime.frame + trimTime.frame)
    }

    loop = Default.instance.audio.loop

    maxFrames(quantize : number, trim? : number) : number {
      const space = trim ? trim : this.trim
      return Math.floor(this.definition.duration * quantize) - space
    }

    startOptions(seconds: number, quantize: number): StartOptions {
      const range = this.timeRange(quantize)

      let offset = 0
      let start = seconds + range.seconds
      let duration = range.lengthSeconds

      if (this.trim) {
        range.frame = this.trim
        offset = range.seconds
      }
      const now = Cache.audibleContext.currentTime
      if (now > start) {
        const dif = now - start
        start = now
        offset += dif
        duration -= dif
      }
      return { start, offset, duration }
    }

    trim = Default.instance.audio.trim

    trimTime(quantize: number): Time { return Time.fromArgs(this.trim, quantize) }

    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.trim !== Default.instance.audio.trim) object.trim = this.trim
      if (this.loop !== Default.instance.audio.loop) object.loop = this.loop
      return object
    }
  }
}
export { AudibleFileMixin }
