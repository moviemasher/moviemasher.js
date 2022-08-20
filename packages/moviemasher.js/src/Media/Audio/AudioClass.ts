import { AudioDefinition, Audio } from "./Audio"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"


const AudioWithTweenable = TweenableMixin(InstanceBase)
const AudioWithContent = ContentMixin(AudioWithTweenable)
const AudioWithPreloadable = PreloadableMixin(AudioWithContent)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {
  declare definition : AudioDefinition

  mutable() { return true }
}
