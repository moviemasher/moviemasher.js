import { DefinitionType, LoadType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioDefinition, AudioDefinitionObject, AudioObject } from "./Audio"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"


const AudioDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const AudioDefinitionWithContent = ContentDefinitionMixin(AudioDefinitionWithTweenable)
const AudioDefinitionWithPreloadable = PreloadableDefinitionMixin(AudioDefinitionWithContent)
const AudioDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioDefinitionWithPreloadable)
export class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration implements AudioDefinition {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { audioUrl, url } = object as AudioDefinitionObject
    if (!audioUrl && url) this.audioUrl = url
  }

  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  type = DefinitionType.Audio

  loadType = LoadType.Audio
}
