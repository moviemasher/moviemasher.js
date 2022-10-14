import { AudioDefinition, Audio } from "./Audio"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgItem } from "../../declarations"
import { svgPolygonElement } from "../../Utility/Svg"


const AudioWithTweenable = TweenableMixin(InstanceBase)
const AudioWithContent = ContentMixin(AudioWithTweenable)
const AudioWithPreloadable = PreloadableMixin(AudioWithContent)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
    return Promise.resolve(svgPolygonElement(containerRect, '', 'currentColor'))
  }

  declare definition : AudioDefinition

  mutable() { return true }

}
