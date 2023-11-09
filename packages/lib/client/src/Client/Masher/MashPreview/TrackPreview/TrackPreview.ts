import type { ClientClip, ClientInstance, SvgItem, SvgItems } from '@moviemasher/runtime-client'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import type { MashPreview } from '../MashPreview.js'

export interface TrackPreviewArgs {
  clip: ClientClip
  preview: MashPreview
  timeRange: TimeRange
  tweenTime?: Time
  icon?: boolean
}

export interface TrackPreview {
  editingSvgItem(classes: string[], inactive?: boolean): SvgItem
  clip: ClientClip
  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
  container: ClientInstance
}

export interface TrackPreviews extends Array<TrackPreview>{}
