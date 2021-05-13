import { ClipType } from "../Types"
import { sharedClip } from "./with/sharedClip"
import { visible } from "./with/visible"
import { urls } from "./with/urls"
import { audible } from "./with/audible"
import { transform } from "./with/transform"
import { mediaTimeFromTrim } from "./with/mediaTimeFromTrim"

function VideoClip(object) { this.object = object }

Object.defineProperties(VideoClip.prototype, {
  type: { value: ClipType.video },
  ...sharedClip,
  ...visible,
  ...audible,
  ...urls,
  ...transform,
  ...mediaTimeFromTrim,
})

export { VideoClip }
