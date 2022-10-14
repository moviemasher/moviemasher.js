
import { SvgItem, SvgItems, SvgItemsTuple } from "../../../../declarations"

import { Time, TimeRange } from "../../../../Helpers/Time/Time"
import { Clip } from "../../Track/Clip/Clip"
import { Preview } from "../Preview"
import { Anchor } from "../../../../Setup/Enums"
import { Container } from "../../../../Container/Container"
import { Rect } from "../../../../Utility/Rect"
import { Editor } from "../../../../Editor/Editor"

export interface TrackPreviewArgs {
  clip: Clip
  preview: Preview
  timeRange: TimeRange
  tweenTime?: Time
  icon?: boolean
}

export interface TrackPreview {
  editingSvgItem(classes: string[], inactive?: boolean): SvgItem
  id: string
  clip: Clip
  editor: Editor
  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
  container: Container
  rect: Rect
}

export type TrackPreviews = TrackPreview[]
