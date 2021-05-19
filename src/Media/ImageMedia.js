import { MediaType } from "../Setup"
import { modularFalse } from "./with/modularFalse"
import { inaudible } from "./with/inaudible"
import { visibleMedia } from "./with/visibleMedia"
import { duration } from "./with/duration"
import { urlVisible } from "./with/urlVisible"
import { urlsVisible } from "./with/urlsVisible"
import { sharedMedia } from "./with/sharedMedia"
import { propertiesTiming } from "./with/propertiesTiming"
import { Media } from "./Media"

class ImageMedia extends Media {}

Object.defineProperties(ImageMedia.prototype, {
  type: { value: MediaType.image },
  ...sharedMedia,
  ...modularFalse,
  ...inaudible,
  ...visibleMedia,
  ...duration,
  ...propertiesTiming,
  ...urlVisible,
  ...urlsVisible,
})

export { ImageMedia }
