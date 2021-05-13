import { MediaType } from "../Types";
import { sharedMedia } from "./with/sharedMedia"
import { inaudible } from "./with/inaudible"
import { visible } from "./with/visible"
import { transform } from "./with/transform";

function EffectMedia(object) { this.object = object }

Object.defineProperties(EffectMedia.prototype, {
  type: { value: MediaType.effect },
  ...sharedMedia,
  ...transform,
  ...inaudible,
  ...visible,
})

export { EffectMedia }
