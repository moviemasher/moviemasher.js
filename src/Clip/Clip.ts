import { Base } from "../Base"
import { MediaUtilized } from "../Decorators/MediaUtilized"
import { Media } from "../Media"
import { Time, TimeRange } from "../Utilities"
import { UrlsByType } from "../Loading"
import { TimeFactory } from "../Factory/TimeFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { toJSON } from "./with/toJSON"
import { track } from "./with/track"
import { id } from "./with/id"
import { labelFromObjectOrMedia } from "./with/labelFromObjectOrMedia"
import { media } from "./with/media"
import { propertyValues } from "./with/propertyValues"
import { copy } from "./with/copy"
import { editable } from "../Base/with/editable"
import { Effect, Merger, Scaler } from "../Transform"

@MediaUtilized
class Clip extends Base {
  id : string

  copy : Clip

  frame : number

  frames : number

  scaler : Scaler

  merger : Merger

  effects : Effect[]

  from? : object

  to? : object

  media : Media

  mediaUtilized : Media[]

  type: string

  constructor(object = {}) {
    super(object)
    this.media.initializeInstance(this, object)
  }

  load(mashTimeRange : TimeRange) : Promise<any> {
    const urls = this.urlsVisibleInTimeRangeByType(mashTimeRange)
    return urls.load()
  }

  get properties() { return this.media.properties }

  urlsVisibleInTimeRangeByType(_timeRange : TimeRange) : UrlsByType {
    return UrlsByType.none
  }

  time(quantize : number) : Time {
    return TimeFactory.createFromFrame(this.frame, quantize)
  }

  timeRange(quantize : number) : TimeRange {
    const options = { frame: this.frame, quantize, frames: this.frames }
    return TimeRangeFactory.createFromOptions(options)
  }

  timeRangeRelative(mashTime : Time) {
    const range = this.timeRange(mashTime.fps)
    const frame = mashTime.frame - this.frame
    return range.withFrame(frame)
  }
}

Object.defineProperties(Clip.prototype, {
  ...editable,
  ...copy,
  ...toJSON,
  ...id,
  ...labelFromObjectOrMedia,
  ...track,
  ...media,
  ...propertyValues,
})

export { Clip }
