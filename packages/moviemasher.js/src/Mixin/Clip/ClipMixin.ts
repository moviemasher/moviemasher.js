import { Scalar } from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { DataType, TrackType } from "../../Setup/Enums"
import { Time, TimeRange  } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { ClipClass, ClipObject, ClipDefinition, Clip } from "./Clip"
// import { urlForEndpoint } from "../../Utility/Url"
import { Loader } from "../../Loader/Loader"
// import { BrowserLoaderClass } from "../../Loader/BrowserLoaderClass"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { PropertyTweenSuffix } from "../../Base"
import { assertNumber, assertString, isUndefined } from "../../Utility/Is"
import { colorRgbaToHex, colorRgbToHex, colorToRgb, colorToRgba } from "../../Utility/Color"
import { pixelsMixRbg, pixelsMixRbga } from "../../Utility/Pixel"
import { assertPropertyTypeColor } from "../../Helpers/PropertyType"


export function ClipMixin<T extends InstanceClass>(Base: T): ClipClass & T {
  return class extends Base implements Clip {
    constructor(...args : any[]) {
      super(...args)
      const [object] = args
      const { track } = <ClipObject> object
      if (typeof track !== "undefined") this.track = track
    }

    audible = false

    copy(): Clip {
      const clipObject: ClipObject = this.toJSON()
      clipObject.id = ''
      clipObject.track = this.track
      return this.definition.instanceFromObject(clipObject) as Clip
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

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }

    iconUrl(preloader: Loader): string | undefined {
      const { icon } = this.definition
      if (!icon) return

      // const browserLoaderClass = preloader // as BrowserLoaderClass
      // const url = urlForEndpoint(browserLoaderClass.endpoint, icon)
      // return url
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

    effectable = false

    
    visible = false
  }
}
