import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { TrackType } from "../../Setup/Enums"
import { Time, TimeRange  } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { ClipClass, ClipDefinition, Clip } from "./Clip"
import { Loader } from "../../Loader/Loader"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"


export function ClipMixin<T extends InstanceClass>(Base: T): ClipClass & T {
  return class extends Base implements Clip {
    copy(): Clip {
      const object = { ...this.toJSON(), id: '' }
      return this.definition.instanceFromObject(object) as Clip
    }

    declare definition: ClipDefinition

    definitionTime(quantize : number, time : Time) : Time {
      const scaledTime = super.definitionTime(quantize, time)
      const startTime = this.time(quantize).scale(scaledTime.fps)
      const endTime = this.endTime(quantize).scale(scaledTime.fps)

      const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
      return scaledTime.withFrame(frame - startTime.frame)
    }

    get endFrame() { return this.frame + this.frames }

    endTime(quantize : number) : Time {
      return timeFromArgs(this.endFrame, quantize)
    }

    declare frame: number

    declare frames: number

    clipGraphFiles(args: GraphFileArgs): GraphFiles { return [] }

    iconUrl(preloader: Loader): string | undefined {
      const { icon } = this.definition
      if (!icon) return

    }

    maxFrames(_quantize : number, _trim? : number) : number { return 0 }

    time(quantize : number) : Time { return timeFromArgs(this.frame, quantize) }

    timeRange(quantize : number) : TimeRange {
      return timeRangeFromArgs(this.frame, quantize, this.frames)
    }

    timeRangeRelative(timeRange : TimeRange, quantize : number) : TimeRange {
      const range = this.timeRange(quantize).scale(timeRange.fps)
      const frame = Math.max(0, timeRange.frame - range.frame)

      return timeRange.withFrame(frame)
    }

    trackType = TrackType.Video

    effectable = false

  }
}
