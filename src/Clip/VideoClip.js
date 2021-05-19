import { ClipType } from "../Setup"
import { sharedClip } from "./with/sharedClip"
import { visibleClip } from "./with/visibleClip"
import { urls } from "./with/urls"
import { audible } from "./with/audible"
import { transform } from "./with/transform"
import { mediaTimeFromTrim } from "./with/mediaTimeFromTrim"

function VideoClip(object) { this.object = object }

Object.defineProperties(VideoClip.prototype, {
  type: { value: ClipType.video },
  ...sharedClip,
  ...visibleClip,
  ...audible,
  ...urls,
  ...transform,
  ...mediaTimeFromTrim,
})

export { VideoClip }
