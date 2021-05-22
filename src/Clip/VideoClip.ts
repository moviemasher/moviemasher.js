import { ClipType } from "../Setup"
import { urls } from "./with/urls"
import { audible } from "./with/audible"
import { transform } from "./with/transform"
import { mediaTimeFromTrim } from "./with/mediaTimeFromTrim"
import { VisibleClip } from "../Decorators/VisibleClip"
import { Clip } from "./Clip"

@VisibleClip
class VideoClip extends Clip {
  type : string = ClipType.video
}
Object.defineProperties(VideoClip.prototype, {
  ...audible,
  ...urls,
  ...transform,
  ...mediaTimeFromTrim,
})

export { VideoClip }
