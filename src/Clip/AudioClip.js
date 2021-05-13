import { ClipType } from "../Types"
import { sharedClip } from "./with/sharedClip"
import { invisible } from "./with/invisible"
import { audible } from "./with/audible"
import { Clip } from "./Clip"
import { mediaTimeFromTrim } from "./with/mediaTimeFromTrim"

class AudioClip extends Clip {}

Object.defineProperties(AudioClip.prototype, {
  type: { value: ClipType.audio },
  ...sharedClip,
  ...invisible,
  ...audible,
  ...mediaTimeFromTrim,
})

export { AudioClip }
