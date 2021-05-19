import { MediaType } from "../Setup"
import { duration } from "./with/duration"
import { modularFalse } from "./with/modularFalse"
import { sharedMedia } from "./with/sharedMedia"
import { visibleMedia } from "./with/visibleMedia"
import { urlAudibleMute } from "./with/urlAudibleMute"
import { urlsVisibleFrames } from "./with/urlsVisibleFrames"
import { propertiesTiming } from "./with/propertiesTiming"
import { audible } from "./with/audible"
import { Media } from "./Media"

class VideoMedia extends Media {}

Object.defineProperties(VideoMedia.prototype, {
  type: { value: MediaType.video },
  ...sharedMedia,
  ...modularFalse,
  ...visibleMedia,
  ...duration,
  ...urlAudibleMute,
  ...urlsVisibleFrames,
  ...audible,
  ...propertiesTiming,
})

export { VideoMedia }
