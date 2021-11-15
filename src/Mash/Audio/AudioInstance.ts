import { TrackType } from "../../Setup/Enums"
import { AudioDefinition } from "./Audio"
import { InstanceBase } from "../Instance/Instance"
import { AudibleMixin } from "../Mixin/Audible/AudibleMixin"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { AudibleFileMixin } from "../Mixin/AudibleFile/AudibleFileMixin"

const AudioWithClip = ClipMixin(InstanceBase)
const AudioWithAudible = AudibleMixin(AudioWithClip)
const AudioWithAudibleFile = AudibleFileMixin(AudioWithAudible)
class AudioClass extends AudioWithAudibleFile {
  declare definition : AudioDefinition

  trackType = TrackType.Audio
}


export { AudioClass }
