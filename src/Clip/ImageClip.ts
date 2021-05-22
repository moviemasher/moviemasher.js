import { ClipType } from "../Setup"
import { inaudible } from "./with/inaudible"
import { urls } from "./with/urls"
import { transform } from "./with/transform"
import { drawImage } from "./with/drawImage"
import { Clip } from "./Clip"
import { mediaTime } from "./with/mediaTime"
import { VisibleClip } from "../Decorators/VisibleClip"

@VisibleClip
class ImageClip extends Clip {
  type : string = ClipType.image
}

Object.defineProperties(ImageClip.prototype, {
  ...inaudible,
  ...urls,
  ...transform,
  ...drawImage,
  ...mediaTime,
})

export { ImageClip }
