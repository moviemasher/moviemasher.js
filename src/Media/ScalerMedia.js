import { MediaType } from "../Setup"
import { Media } from "./Media"
import { drawFilters } from "./with/drawFilters"
import { inaudible } from "./with/inaudible"
import { sharedMedia } from "./with/sharedMedia"
import { transform } from "./with/transform"

class ScalerMedia extends Media {}

Object.defineProperties(ScalerMedia.prototype, {
  type: { value: MediaType.scaler },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...drawFilters,
})

export { ScalerMedia }
