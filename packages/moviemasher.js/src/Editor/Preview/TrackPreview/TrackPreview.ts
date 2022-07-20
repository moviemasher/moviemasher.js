import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { Preview } from "../Preview"
import { Evaluator } from "../../../Helpers/Evaluator"
import { Size } from "../../../Utility/Size"

export interface TrackPreviewArgs {
  clip: VisibleClip
  preview: Preview
  timeRange: TimeRange
  tweenTime?: Time,
}

export interface TrackPreview {

  evaluator: Evaluator
  size: Size
  clip: VisibleClip
  preview: Preview
  selected: boolean
  svg: SVGSVGElement
}

export type TrackPreviews = TrackPreview[]