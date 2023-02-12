
import { SvgItem, SvgItems } from "../../../Helpers/Svg/Svg"

import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { Clip } from "../../../Media/Mash/Track/Clip/Clip"
import { Preview } from "../Preview"
import { Container } from "../../../Media/Container/Container"
import { Editor } from "../../Editor"

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
  editor: Editor
  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
  container: Container
  // rect: Rect
}

export type TrackPreviews = TrackPreview[]
