import { Any, Constrained, JsonObject, LoadPromise } from "../../../declarations"
import { TrackType } from "../../../Setup/Enums"
import { Time  } from "../../../Utilities/Time"
import { Is } from "../../../Utilities/Is"
import { TimeRange } from "../../../Utilities/TimeRange"
import { Instance } from "../../Instance"
import { ClipObject } from "./Clip"


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ClipMixin<TBase extends Constrained<Instance>>(Base: TBase) {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { frame, frames, track } = <ClipObject> object

      if (typeof frame !== "undefined" && Is.positive(frame)) this.frame = frame
      if (frames && Is.aboveZero(frames)) this.frames = frames
      if (typeof track !== "undefined") this.track = track
    }

    audible = false

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      const startTime = this.time(quantize).scale(scaledTime.fps)
      const endTime = this.endTime(quantize).scale(scaledTime.fps)
      const frame = Math.max(Math.min(time.frame, endTime.frame), startTime.frame)
      return scaledTime.withFrame(frame - startTime.frame)
    }

    get endFrame() { return this.frame + this.frames }

    endTime(quantize : number) : Time {
      return Time.fromArgs(this.endFrame, quantize)
    }

    frame = 0

    frames = -1

    maxFrames(_quantize : number, _trim? : number) : number { return 0 }

    time(quantize : number) : Time { return Time.fromArgs(this.frame, quantize) }

    timeRange(quantize : number) : TimeRange {
      return TimeRange.fromArgs(this.frame, quantize, this.frames)
    }

    timeRangeRelative(time : Time, quantize : number) : TimeRange {
      const range = this.timeRange(quantize).scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      return range.withFrame(frame)
    }

    toJSON() : JsonObject {
      const object = super.toJSON()
      object.id = this.id
      return object
    }

    track = -1

    trackType = TrackType.Video

    visible = false
  }
}

export { ClipMixin }
