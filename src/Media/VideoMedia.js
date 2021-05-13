import { MediaType } from "../Types"
import { duration } from "./with/duration"
import { modularFalse } from "./with/modularFalse"
import { sharedMedia } from "./with/sharedMedia"
import { visible } from "./with/visible"
import { urlAudibleMute } from "./with/urlAudibleMute"
import { urlsVisibleFrames } from "./with/urlsVisibleFrames"
import { propertiesTiming } from "./with/propertiesTiming"
import { audible } from "./with/audible"

function VideoMedia(object) { this.object = object }

Object.defineProperties(VideoMedia.prototype, {
  type: { value: MediaType.video },
  ...sharedMedia,
  ...modularFalse,
  ...visible,
  ...duration,
  ...urlAudibleMute,
  ...urlsVisibleFrames,
  ...audible,
  ...propertiesTiming,  
})

export { VideoMedia }