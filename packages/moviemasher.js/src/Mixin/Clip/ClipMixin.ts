import { Any, FilesArgs, GraphFiles } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time, TimeRange  } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Base/Instance"
import { ClipClass, ClipObject, ClipDefinition, Clip } from "./Clip"
import { Errors } from "../../Setup/Errors"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { urlForEndpoint } from "../../Utility/Url"
import { Preloader } from "../../Preloader/Preloader"
import { BrowserPreloaderClass } from "../../Preloader/BrowserPreloaderClass"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"


function ClipMixin<T extends InstanceClass>(Base: T): ClipClass & T {
  return class extends Base implements Clip {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { track } = <ClipObject> object
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
      return timeFromArgs(this.endFrame, quantize)
    }

    declare frame: number // = 0

    declare frames: number // = -1

    clipFiles(args: FilesArgs): GraphFiles {
      const { quantize, time } = args
      const definitionTime = this.definitionTime(quantize, time)

      const definitionArgs: FilesArgs = { ...args, time: definitionTime }
      return this.definition.definitionFiles(definitionArgs)
    }

    filterChain(_: FilterChain): void {
      throw Errors.unimplemented + 'filterChain'
    }

    iconUrl(preloader: Preloader): string | undefined {
      const { icon } = this.definition
      if (!icon) return

      const browserPreloaderClass = preloader as BrowserPreloaderClass
      const url = urlForEndpoint(browserPreloaderClass.endpoint, icon)
      return url
    }

    initializeFilterChain(_: FilterChain): void {
      throw Errors.unimplemented + 'initializeFilterChain'
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

    track = -1

    trackType = TrackType.Video

    transformable = false

    visible = false
  }
}

export { ClipMixin }
