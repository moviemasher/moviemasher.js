import { MediaType, TrackType } from "../Types"
import { modularFalse } from "./with/modularFalse"
import { invisible } from "./with/invisible"
import { duration } from "./with/duration"
import { urlAudible } from "./with/urlAudible"
import { sharedMedia } from "./with/sharedMedia"
import { propertiesTiming } from "./with/propertiesTiming"
import { audible } from "./with/audible"

function AudioMedia(object) { this.object = object }

Object.defineProperties(AudioMedia.prototype, {
  type: { value: MediaType.audio },
  trackType: { value: TrackType.audio },
  ...sharedMedia,
  ...modularFalse,
  ...invisible,
  ...duration,
  ...urlAudible,
  ...audible,
  ...propertiesTiming,
})

export { AudioMedia }