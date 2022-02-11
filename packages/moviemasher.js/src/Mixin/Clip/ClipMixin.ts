import { Any, GraphFile, GraphFilter, GraphInput, FilterChain, FilterChainArgs, LoadPromise, Size, StringObject, FilesArgs } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time"
import { Is } from "../../Utility/Is"
import { TimeRange } from "../../Helpers/TimeRange"
import { InstanceClass } from "../../Base/Instance"
import { ClipClass, ClipObject, ClipDefinition, Clip } from "./Clip"
import { Errors } from "../../Setup/Errors"


function ClipMixin<T extends InstanceClass>(Base: T): ClipClass & T {
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

    clipUrls(quantize : number, start : Time, end? : Time) : string[] {
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      return this.definition.definitionUrls(startTime, endTime)
    }

    get copy(): Clip {
      const clipObject: ClipObject = this.toJSON()
      clipObject.id = ''
      clipObject.track = this.track
      return <Clip> this.definition.instanceFromObject(clipObject)
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
      return Time.fromArgs(this.endFrame, quantize)
    }

    frame = 0

    frames = -1

    files(args: FilesArgs): GraphFile[] {
      const { quantize, start, end } = args
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      const definitionArgs: FilesArgs = { ...args, start: startTime, end: endTime }
      return this.definition.files(definitionArgs)
    }

    filterChain(_: FilterChainArgs): FilterChain | undefined { return }

    filterChainBase(_: FilterChainArgs): FilterChain | undefined {
      const filters: GraphFilter[] = []
      const inputs: GraphInput[] = []
      const files: GraphFile[] = []

      const layer: FilterChain = { filters, inputs, files }
      return layer
    }

    filterChains(args: FilterChainArgs): FilterChain[] {
      // TODO: add audio chain to
      const layer = this.filterChain(args)
      if (!layer) throw Errors.internal + 'layer'

      return [layer]
    }

    // loadClip(quantize : number, start : Time, end? : Time) : LoadPromise | void {
    //   const startTime = this.definitionTime(quantize, start)
    //   const endTime = end ? this.definitionTime(quantize, end) : end
    //   return this.definition.loadDefinition(quantize, startTime, endTime)
    // }

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

    track = -1

    trackType = TrackType.Video

    visible = false
  }
}

export { ClipMixin }
