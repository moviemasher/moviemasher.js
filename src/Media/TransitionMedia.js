import { MediaType } from "../Setup"
import { Media } from "./Media"
import { duration } from "./with/duration"
import { inaudible } from "./with/inaudible"
import { modular } from "./with/modular"
import { propertiesTiming } from "./with/propertiesTiming"
import { sharedMedia } from "./with/sharedMedia"
import { urlsNone } from "./with/urlsNone"
import { visibleMedia } from "./with/visibleMedia"

class TransitionMedia extends Media {}

Object.defineProperties(TransitionMedia.prototype, {
  type: { value: MediaType.transition },
  ...sharedMedia,
  ...modular,
  ...inaudible,
  ...visibleMedia,
  ...propertiesTiming,
  ...duration,
  ...urlsNone,
})

export { TransitionMedia }
