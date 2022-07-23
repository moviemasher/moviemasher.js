import { UnknownObject } from "../../../declarations"
import { isTrackType, TrackType } from "../../../Setup/Enums"
import { Clips, ClipObject, Clip } from "../../../Mixin/Clip/Clip"
import { Propertied } from "../../../Base/Propertied"
import { isObject } from "../../../Utility/Is"
import { Mash } from "../Mash"

export interface TrackObject extends UnknownObject {
  clips?: ClipObject[]
  dense?:  boolean
  layer?: number
  trackType?: TrackType
}
export const isTrackObject = (value?: any): value is TrackObject => {
  return isObject(value) && isTrackType(value.trackType)
}


export interface TrackArgs extends TrackObject {
}

export interface Track extends Propertied {
  addClip(clip: Clip, insertIndex?: number): void
  assureFrame(clips?: Clips): boolean
  assureFrames(quantize: number, clips?: Clips): void
  clips: Clips
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  identifier: string
  layer: number
  mash: Mash
  removeClip(clip: Clip): void
  sortClips(clips?: Clips): boolean
  trackType: TrackType
}
export const isTrack = (value?: any): value is Track => {
  return isObject(value) && "addClip" in value
}


export type Tracks = Track[]
