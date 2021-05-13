
import { MediaType } from "../Types";
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { transform } from "./with/transform";
import { drawFilters } from "./with/drawFilters";

function MergerMedia(object) { this.object = object }

Object.defineProperties(MergerMedia.prototype, {
  type: { value: MediaType.merger },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...drawFilters,
})

export { MergerMedia }
