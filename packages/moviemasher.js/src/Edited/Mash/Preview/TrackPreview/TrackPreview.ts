
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
  editingSvgItem(className?: string, active?: boolean, id?: string): SvgItem
  id: string
  clip: Clip
  editor: Editor
  svgBoundsElement(active?: boolean, id?: string): SVGGElement 
  container: Container
  rect: Rect
}

export type TrackPreviews = TrackPreview[]
