import { MediaType } from "../Types"
import { duration } from "./with/duration"
import { filters } from "./with/filters"
import { html } from "./with/html"
import { inaudible } from "./with/inaudible"
import { modular } from "./with/modular"
import { propertiesModular } from "./with/propertiesModular"
import { propertiesTiming } from "./with/propertiesTiming"
import { sharedMedia } from "./with/sharedMedia"
import { urlsFromFilters } from "./with/urlsFromFilters"
import { visible } from "./with/visible"

function ThemeMedia(object = {}) { 
  this.object = object 
  
}

Object.defineProperties(ThemeMedia.prototype, {
  type: { value: MediaType.theme },
  ...sharedMedia,
  ...modular,
  ...inaudible,
  ...visible,
  ...duration,
  ...filters,
  ...propertiesModular,
  ...propertiesTiming,
  ...html,
  ...urlsFromFilters,
})

export { ThemeMedia }
