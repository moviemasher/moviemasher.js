
import { MediaType } from "../Setup"
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { transform } from "./with/transform"
import { drawFilters } from "./with/drawFilters"
import { Media } from "./Media"

class MergerMedia extends Media {
  type : string = MediaType.merger
}

Object.defineProperties(MergerMedia.prototype, {
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...drawFilters,
})

export { MergerMedia }
