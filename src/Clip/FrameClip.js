import { ClipType } from "../Setup"
import { sharedClip } from "./with/sharedClip"
import { visibleClip } from "./with/visibleClip"
import { urls } from "./with/urls"
import { mediaTime } from "./with/mediaTime"

function FrameClip(object) { this.object = object }

Object.defineProperties(FrameClip.prototype, {
  type: { value: ClipType.frame },
  ...sharedClip,
  ...visibleClip,
  ...urls,
  ...mediaTime,
})


export { FrameClip }