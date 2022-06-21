import { ChainBuilder, GraphFilter, Transforms } from "../../../MoveMe"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { Clip } from "../../../Mixin/Clip/Clip"
import { Preview } from "../Preview"

export interface TrackPreviewArgs {
  clip: VisibleClip
  filterGraph: Preview
  graphFilter?: GraphFilter
  timeRange: TimeRange
  tweenTime?: Time,
}

export interface TrackPreview extends ChainBuilder{
  clip: Clip
  filterGraph: Preview
  selected: boolean
  svg: SVGSVGElement
  transforms: Transforms
}

export type TrackPreviews = TrackPreview[]
