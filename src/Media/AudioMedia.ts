import { MediaType, TrackType } from "../Setup"
import { modularFalse } from "./with/modularFalse"
import { invisible } from "./with/invisible"
import { duration } from "./with/duration"
import { urlAudible } from "./with/urlAudible"
import { sharedMedia } from "./with/sharedMedia"
import { propertiesTiming } from "./with/propertiesTiming"
import { audible } from "./with/audible"
import { Media } from "./Media"

class AudioMedia extends Media {
  type : string = MediaType.audio
  trackType : string = TrackType.audio
}

Object.defineProperties(AudioMedia.prototype, {
  ...sharedMedia,
  ...modularFalse,
  ...invisible,
  ...duration,
  ...urlAudible,
  ...audible,
  ...propertiesTiming,
})

export { AudioMedia }
