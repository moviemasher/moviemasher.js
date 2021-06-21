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

    definition! : AudibleDefinition

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      if (!Is.aboveZero(this.trim)) return scaledTime

      const trimTime = this.trimTime(quantize).scale(scaledTime.fps)
      return scaledTime.withFrame(scaledTime.frame + trimTime.frame)
    }

    gain = Default.clip.audio.gain

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

    mediaTime(time : Time, addOneFrame = false) : Time {
      const { fps } = time
      const endFrame = this.frame + this.frames
      const endTime = Time.fromArgs(endFrame, fps)
      const limitedTime = time.min(endTime)
      const startTime = Time.fromArgs(this.frame, fps)
      let mediaTime = limitedTime.subtract(startTime)

      if (addOneFrame) {
        const addTime = Time.fromArgs(1, fps)
        mediaTime = mediaTime.add(addTime)
      }
      if (this.trim === Default.clip.audio.trim) return mediaTime


        const addTime = Time.fromArgs(this.trim, fps)
        return mediaTime.add(addTime)
    }

    mediaTimeRange(timeRange : TimeRange) : TimeRange {
      const addOneFrame = (timeRange.frames > 1)
      return TimeRange.fromTimes(
        this.mediaTime(timeRange.startTime),
        this.mediaTime(timeRange.endTime, addOneFrame)
      )
    }


    // timeRangeRelative(time : Time, quantize : number) : TimeRange {
    //   const range = super.timeRangeRelative(time, quantize)
    //   return this.mediaTimeRange(range)

    //   // this.timeRange(quantize).scale(time.fps)
    //   // const trimTime = Time.fromArgs(this.trim, quantize).scale(time.fps)

    //   // const frame = time.frame + trimTime.frame - range.frame
    //   // const frames = range.frames - trimTime.frame
    //   // return TimeRange.fromArgs(frame, range.fps, frames)
    // }

    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.trim !== Default.clip.audio.trim) object.trim = this.trim
      if (this.gain !== Default.clip.audio.gain) object.gain = this.gain
      return object
    }

    trim = Default.clip.audio.trim

    trimTime(quantize : number) : Time { return Time.fromArgs(this.trim, quantize) }


  }
}

export { AudibleMixin }
