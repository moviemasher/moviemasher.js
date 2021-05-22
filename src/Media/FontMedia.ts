import { MediaType } from "../Setup"
import { filters } from "./with/filters"
import { urlsFromFilters } from "./with/urlsFromFilters"
import { inaudible } from "./with/inaudible"
import { sharedMedia } from "./with/sharedMedia"
import { Media } from "./Media"

class FontMedia extends Media {
  type : string = MediaType.font
}

Object.defineProperties(FontMedia.prototype, {
  ...sharedMedia,
  ...filters,
  ...urlsFromFilters,
  ...inaudible,
})

export { FontMedia }
