import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { Clip } from "../../../Edited/Mash/Track/Clip/Clip"
import { Preview, Svg } from "../Preview"

export interface TrackPreviewArgs {
  clip: Clip
  preview: Preview
  timeRange: TimeRange
  tweenTime?: Time
}

export interface TrackPreview {
  svg: Promise<Svg>
}

export type TrackPreviews = TrackPreview[]
