import { MediaType } from "../Setup"
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { visibleMedia } from "./with/visibleMedia"
import { transform } from "./with/transform"
import { Media } from "./Media"

class EffectMedia extends Media {
  type : string = MediaType.effect
}

Object.defineProperties(EffectMedia.prototype, {
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...visibleMedia,
})

export { EffectMedia }
