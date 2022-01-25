import { Any, GraphFile, GraphFilter, GraphInput, Layer, LayerArgs, LoadPromise, Size, StringObject } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time"
import { Is } from "../../Utilities/Is"
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

    layer(_: LayerArgs): Layer | undefined { return }

    layerBase(_: LayerArgs): Layer | undefined {
      const source = this.definition.inputSource
      // const merger = { filter: 'overlay', options: { x: 0, y: 0 } }
      const filters: GraphFilter[] = []
      const inputs: GraphInput[] = []
      const files: GraphFile[] = []
      if (source) inputs.push({ source })
      const layer: Layer = { filters, layerInputs: inputs, files }
      return layer
    }

    layerOrThrow(args: LayerArgs): Layer {
      const layer = this.layer(args)
      if (!layer) throw Errors.internal

      return layer
    }

    loadClip(quantize : number, start : Time, end? : Time) : LoadPromise | void {
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      return this.definition.loadDefinition(quantize, startTime, endTime)
    }

    clipUrls(quantize : number, start : Time, end? : Time) : string[] {
      const startTime = this.definitionTime(quantize, start)
      const endTime = end ? this.definitionTime(quantize, end) : end
      return this.definition.definitionUrls(startTime, endTime)
    }

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
