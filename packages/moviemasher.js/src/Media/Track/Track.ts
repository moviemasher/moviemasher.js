import { UnknownObject } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Clips, ClipObject, Clip } from "../../Mixin/Clip/Clip"
import { Propertied } from "../../Base/Propertied"
import { Definition } from "../../Base/Definition"

export interface TrackObject extends UnknownObject {
  clips?: ClipObject[]
  dense?:  boolean
  layer?: number
  trackType?: TrackType
}

export interface TrackArgs extends TrackObject {
  definitions?: Definition[]
}

export interface Track extends Propertied {
  addClip(clip: Clip, insertIndex?: number): void
  assureFrame(clips?: Clips): boolean
  assureFrames(quantize: number, clips?: Clips): boolean
  clips: Clips
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  layer: number
  removeClip(clip: Clip): void
  sortClips(clips?: Clips): boolean
  trackType: TrackType
}

export type Tracks = Track[]
