import { MediaType } from "../Types";
import { drawFilters } from "./with/drawFilters";
import { inaudible } from "./with/inaudible"
import { sharedMedia } from "./with/sharedMedia"
import { transform } from "./with/transform";

function ScalerMedia(object) { this.object = object }

Object.defineProperties(ScalerMedia.prototype, {
  type: { value: MediaType.scaler },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...drawFilters,
})

export { ScalerMedia }
