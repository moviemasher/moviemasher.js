import type { AudioMedia, Audio } from './Audio.js'
import type { Rect } from '../../Utility/Rect.js'
import type { Time, TimeRange } from '../../Helpers/Time/Time.js'
import type { SvgItem } from '../../Helpers/Svg/Svg.js'
import type { Component } from '../../Base/Code.js'

import { svgPolygonElement } from '../../Helpers/Svg/SvgFunctions.js'
import { MediaInstanceBase } from '../MediaInstanceBase.js'
import { UpdatableDurationMixin } from '../../Mixin/UpdatableDuration/UpdatableDurationMixin.js'
import { ContentMixin } from '../Content/ContentMixin.js'
import { TweenableMixin } from '../../Mixin/Tweenable/TweenableMixin.js'

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
