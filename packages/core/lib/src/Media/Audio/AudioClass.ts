import { AudioMedia, Audio } from "./Audio"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContentMixin } from "../Content/ContentMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { svgPolygonElement } from "../../Helpers/Svg/SvgFunctions"
import { MediaInstanceBase } from "../MediaInstanceBase"
import { Component } from "../../Base/Code"


const AudioWithTweenable = TweenableMixin(MediaInstanceBase)
const AudioWithContent = ContentMixin(AudioWithTweenable)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithContent)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
    console.trace(this.constructor.name, 'contentPreviewItemPromise')
    return Promise.resolve(svgPolygonElement(containerRect, '', 'currentColor'))
  }

  declare definition : AudioMedia

  mutable() { return true }

}
