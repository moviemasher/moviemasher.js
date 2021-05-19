import { MediaType } from "../Setup"
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { visibleMedia } from "./with/visibleMedia"
import { transform } from "./with/transform"
import { Media } from "./Media"

class EffectMedia extends Media {}

Object.defineProperties(EffectMedia.prototype, {
  type: { value: MediaType.effect },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...visibleMedia,
})

export { EffectMedia }
