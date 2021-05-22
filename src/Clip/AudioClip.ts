import { ClipType } from "../Setup"
import { invisible } from "./with/invisible"
import { audible } from "./with/audible"
import { Clip } from "./Clip"
import { mediaTimeFromTrim } from "./with/mediaTimeFromTrim"

class AudioClip extends Clip {
  type : string = ClipType.audio
}

Object.defineProperties(AudioClip.prototype, {
  ...invisible,
  ...audible,
  ...mediaTimeFromTrim,
})

export { AudioClip }
