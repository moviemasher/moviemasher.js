import { UnknownObject, StartOptions, Any } from "../../declarations"
import { Default } from "../../Setup/Default"
import { Is } from "../../Utility/Is"
import { Time } from "../../Helpers/Time/Time"
import { AudibleClass } from "../Audible/Audible"
import { AudibleFileClass, AudibleFileDefinition } from "./AudibleFile"
import { timeFromArgs } from "../../Helpers/Time/TimeUtilities"


export function AudibleFileMixin<T extends AudibleClass>(Base: T): AudibleFileClass & T {
  return class extends Base {
    declare definition : AudibleFileDefinition

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (!Is.aboveZero(this.trim)) return scaledTime

      const trimTime = this.trimTime(quantize).scale(scaledTime.fps)
      return scaledTime.withFrame(scaledTime.frame + trimTime.frame)
    }

    declare loop: number// = Default.instance.audio.loop

    maxFrames(quantize : number, trim? : number) : number {
      const space = trim ? trim : this.trim
      return Math.floor(this.definition.duration * quantize) - space
    }

    startOptions(seconds: number, quantize: number): StartOptions {
      const range = this.timeRange(quantize)
      let offset = 0
      let start = range.seconds - seconds
      let duration = range.lengthSeconds

      if (this.trim) { offset = timeFromArgs(this.trim, quantize).seconds }

      if (start < 0) {
        offset -= start
        duration += start
        start = 0
      }

      const result = { start, offset, duration }
      // console.log("startOptions", seconds, quantize, result)
      return result
    }

    declare trim: number //= Default.instance.audio.trim

    trimTime(quantize: number): Time { return timeFromArgs(this.trim, quantize) }

    toJSON() : UnknownObject {
      const object = super.toJSON()
      if (this.trim !== Default.instance.audio.trim) object.trim = this.trim
      if (this.loop !== Default.instance.audio.loop) object.loop = this.loop
      return object
    }
  }
}
