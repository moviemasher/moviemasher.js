import { AVType, LoadType, TrackType } from "../../Setup/Enums"
import { AudioDefinition, Audio } from "./Audio"
import { InstanceBase } from "../../Base/Instance"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { AudibleFileMixin } from "../../Mixin/AudibleFile/AudibleFileMixin"
import { Errors } from "../../Setup/Errors"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { GraphFile } from "../../declarations"

const AudioWithClip = ClipMixin(InstanceBase)
const AudioWithAudible = AudibleMixin(AudioWithClip)
const AudioWithAudibleFile = AudibleFileMixin(AudioWithAudible)
class AudioClass extends AudioWithAudibleFile implements Audio {
  declare definition : AudioDefinition

  trackType = TrackType.Audio
}


export { AudioClass }
