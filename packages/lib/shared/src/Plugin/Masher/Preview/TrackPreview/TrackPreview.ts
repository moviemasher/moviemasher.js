import type {Time, TimeRange} from '@moviemasher/runtime-shared'
import type {SvgItem, SvgItems} from '../../../../Helpers/Svg/Svg.js'
import type {Preview} from '../Preview.js'
import type {Masher} from '../../Masher.js'
import type { ClientInstance } from '../../../../Client/ClientTypes.js'
import type { ClientClip } from '../../../../Client/Mash/ClientMashTypes.js'

export interface TrackPreviewArgs {
  clip: ClientClip
  preview: Preview
  timeRange: TimeRange
  tweenTime?: Time
  icon?: boolean
}

export interface TrackPreview {
  editingSvgItem(classes: string[], inactive?: boolean): SvgItem
  clip: ClientClip
  editor: Masher
  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
  container: ClientInstance
}

export type TrackPreviews = TrackPreview[]
