
import { MediaType } from "../Setup"
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { transform } from "./with/transform"
import { drawFilters } from "./with/drawFilters"
import { Media } from "./Media"

class MergerMedia extends Media {}

Object.defineProperties(MergerMedia.prototype, {
  type: { value: MediaType.merger },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...drawFilters,
})

export { MergerMedia }
