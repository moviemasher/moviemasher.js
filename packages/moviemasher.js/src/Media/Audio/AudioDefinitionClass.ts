import { DefinitionType, TrackType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioDefinition, AudioObject } from "./Audio"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

const AudioDefinitionWithClip = ClipDefinitionMixin(PreloadableDefinition)
const AudioDefinitionWithAudible = AudibleDefinitionMixin(AudioDefinitionWithClip)
const AudioDefinitionWithAudibleFile = AudibleFileDefinitionMixin(AudioDefinitionWithAudible)
export class AudioDefinitionClass extends AudioDefinitionWithAudibleFile implements AudioDefinition {
  get instance() : Audio { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : AudioObject) : Audio {
    const audioObject = { ...this.instanceObject, ...object }
    return new AudioClass(audioObject)
  }

  trackType = TrackType.Audio

  type = DefinitionType.Audio
}
