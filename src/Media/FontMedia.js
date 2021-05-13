import { MediaType } from "../Types";
import { filters } from "./with/filters";
import { urlsFromFilters } from "./with/urlsFromFilters";
import { inaudible } from "./with/inaudible";
import { sharedMedia } from "./with/sharedMedia";

function FontMedia(object) { this.object = object }

Object.defineProperties(FontMedia.prototype, {
  type: { value: MediaType.font },
  ...sharedMedia,
  ...filters,
  ...urlsFromFilters,
  ...inaudible,
})

export { FontMedia }
