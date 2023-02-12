import { AudioDefinition, Audio } from "./Audio"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContentMixin } from "../Content/ContentMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { svgPolygonElement } from "../../Helpers/Svg/SvgFunctions"
import { MediaInstanceBase } from "../MediaInstance/MediaInstanceBase"
import { Component } from "../../Base/Code"


const AudioWithTweenable = TweenableMixin(MediaInstanceBase)
const AudioWithContent = ContentMixin(AudioWithTweenable)
const AudioWithPreloadable = PreloadableMixin(AudioWithContent)
const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable)
export class AudioClass extends AudioWithUpdatableDuration implements Audio {
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
    console.trace(this.constructor.name, 'contentPreviewItemPromise')
    return Promise.resolve(svgPolygonElement(containerRect, '', 'currentColor'))
  }

  declare definition : AudioDefinition

  mutable() { return true }

}
