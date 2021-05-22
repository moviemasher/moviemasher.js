import { ClipType } from "../Setup"
import { urls } from "./with/urls"
import { mediaTime } from "./with/mediaTime"
import { VisibleClip } from "../Decorators/VisibleClip"
import { Clip } from "./Clip"

@VisibleClip
class FrameClip extends Clip {
  type : string = ClipType.frame
}

Object.defineProperties(FrameClip.prototype, {
  ...urls,
  ...mediaTime,
})

export { FrameClip }
