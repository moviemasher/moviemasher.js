import { ClipType } from "../Types"
import { sharedClip } from "./with/sharedClip"
import { visible } from "./with/visible"
import { urls } from "./with/urls"
import { mediaTime } from "./with/mediaTime"

function FrameClip(object) { this.object = object }

Object.defineProperties(FrameClip.prototype, {
  type: { value: ClipType.frame },
  ...sharedClip,
  ...visible,
  ...urls,
  ...mediaTime,
})


export { FrameClip }