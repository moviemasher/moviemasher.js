import { DefinitionType, TrackType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioDefinition, AudioObject } from "./Audio"
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
  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  trackType = TrackType.Audio

  type = DefinitionType.Audio
}
