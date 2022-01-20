import { Any } from "../../declarations"
import { DefinitionType, TrackType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Base/Definition"
import { AudioClass } from "./AudioInstance"
import { Audio, AudioDefinition, AudioObject } from "./Audio"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { Definitions } from "../../Definitions/Definitions"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"

const AudioDefinitionWithClip = ClipDefinitionMixin(DefinitionBase)
const AudioDefinitionWithAudible = AudibleDefinitionMixin(AudioDefinitionWithClip)
const AudioDefinitionWithAudibleFile = AudibleFileDefinitionMixin(AudioDefinitionWithAudible)
class AudioDefinitionClass extends AudioDefinitionWithAudibleFile implements AudioDefinition {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  get instance() : Audio { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : AudioObject) : Audio {
    const audioObject = { ...this.instanceObject, ...object }
    return new AudioClass(audioObject)
  }

  trackType = TrackType.Audio

  type = DefinitionType.Audio
}

export { AudioDefinitionClass }
