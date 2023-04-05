
import {SvgItem, SvgItems} from '../../../../Helpers/Svg/Svg.js'

import {Time, TimeRange} from '../../../../Helpers/Time/Time.js'
import {Clip} from '../../../../Media/Mash/Track/Clip/Clip.js'
import {Preview} from '../Preview.js'
import {Container} from '../../../../Media/Container/Container.js'
import {Masher} from '../../Masher.js'

export interface TrackPreviewArgs {
  clip: Clip
  preview: Preview
  timeRange: TimeRange
  tweenTime?: Time
  icon?: boolean
}

export interface TrackPreview {
  editingSvgItem(classes: string[], inactive?: boolean): SvgItem
  clip: Clip
  editor: Masher
  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
  container: Container
  // rect: Rect
}

export type TrackPreviews = TrackPreview[]
