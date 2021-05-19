import { ClipType } from "../Setup"
import { sharedClip } from "./with/sharedClip"
import { inaudible } from "./with/inaudible"
import { visibleClip } from "./with/visibleClip"
import { urls } from "./with/urls"
import { transform } from "./with/transform"
import { drawImage } from "./with/drawImage"
import { Clip } from "./Clip"
import { mediaTime } from "./with/mediaTime"

class ImageClip extends Clip {}

Object.defineProperties(ImageClip.prototype, {
  type: { value: ClipType.image },
  ...sharedClip,
  ...visibleClip,
  ...inaudible,
  ...urls,
  ...transform,
  ...drawImage,
  ...mediaTime,
})

export { ImageClip }
