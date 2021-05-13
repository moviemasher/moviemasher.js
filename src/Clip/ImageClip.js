import { ClipType } from "../Types"
import { sharedClip } from "./with/sharedClip"
import { inaudible } from "./with/inaudible"
import { visible } from "./with/visible"
import { urls } from "./with/urls"
import { transform } from "./with/transform"
import { drawImage } from "./with/drawImage"
import { Clip } from "./Clip"
import { mediaTime } from "./with/mediaTime"

class ImageClip extends Clip {}

Object.defineProperties(ImageClip.prototype, {
  type: { value: ClipType.image },
  ...sharedClip,
  ...visible,
  ...inaudible,
  ...urls,
  ...transform,
  ...drawImage,
  ...mediaTime,
})

export { ImageClip }
