import { Segment, SegmentOptions, SegmentPromise, Size, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"


interface Edited {
  emitter?: Emitter
  segment(options: SegmentOptions): Segment
  segmentPromise(options: SegmentOptions): SegmentPromise
  imageData: VisibleContextData
  imageSize : Size
}

export { Edited }
