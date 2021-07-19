import { DefinitionType, TrackType } from "../../Setup/Enums"
import { DefinitionClass } from "../Definition/Definition"
import { AudioClass } from "./AudioInstance"
import { Audio, AudioObject } from "./Audio"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { AudibleDefinitionMixin } from "../Mixin/Audible/AudibleDefinitionMixin"
import { Definitions } from "../Definitions/Definitions"
import { Any } from "../../declarations"

const AudioDefinitionWithClip = ClipDefinitionMixin(DefinitionClass)
const AudioDefinitionWithAudible = AudibleDefinitionMixin(AudioDefinitionWithClip)
class AudioDefinitionClass extends AudioDefinitionWithAudible {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  get instance() : Audio { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : AudioObject) : Audio {
    // console.log("instanceFromObject", object)
    const audioObject = { ...this.instanceObject, ...object }
    // console.log("instanceFromObject", typeof audioObject.gain, audioObject.gain, object)
    return new AudioClass(audioObject)
  }

  trackType = TrackType.Audio

  type = DefinitionType.Audio
}

export { AudioDefinitionClass }
