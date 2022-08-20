import { DefinitionType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioDefinition, AudioDefinitionObject, AudioObject } from "./Audio"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { LoadedAudio } from "../../declarations"

const AudioDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const AudioDefinitionWithContent = ContentDefinitionMixin(AudioDefinitionWithTweenable)
const AudioDefinitionWithPreloadable = PreloadableDefinitionMixin(AudioDefinitionWithContent)
const AudioDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioDefinitionWithPreloadable)
export class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration implements AudioDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { loadedAudio } = object as AudioDefinitionObject
    if (loadedAudio) this.loadedAudio = loadedAudio

    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  loadedAudio?: LoadedAudio

  type = DefinitionType.Audio
}
