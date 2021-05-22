import { MediaType } from "../Setup"
import { Media } from "./Media"
import { duration } from "./with/duration"
import { filters } from "./with/filters"
import { html } from "./with/html"
import { inaudible } from "./with/inaudible"
import { modular } from "./with/modular"
import { propertiesModular } from "./with/propertiesModular"
import { propertiesTiming } from "./with/propertiesTiming"
import { sharedMedia } from "./with/sharedMedia"
import { urlsFromFilters } from "./with/urlsFromFilters"
import { visibleMedia } from "./with/visibleMedia"

class ThemeMedia extends Media {
  type : string = MediaType.theme
}

Object.defineProperties(ThemeMedia.prototype, {
  ...sharedMedia,
  ...modular,
  ...inaudible,
  ...visibleMedia,
  ...duration,
  ...filters,
  ...propertiesModular,
  ...propertiesTiming,
  ...html,
  ...urlsFromFilters,
})

export { ThemeMedia }
