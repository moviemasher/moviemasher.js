import { TrackType } from "../../Setup/Enums"
import { AudioDefinition } from "./Audio"
import { InstanceClass } from "../Instance/Instance"
import { AudibleMixin } from "../Mixin/Audible/AudibleMixin"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"

const AudioWithClip = ClipMixin(InstanceClass)
const AudioWithAudible = AudibleMixin(AudioWithClip)
class AudioClass extends AudioWithAudible {
  definition! : AudioDefinition

  trackType = TrackType.Audio
}


export { AudioClass }
