import { UnknownObject } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Clips, ClipObject, Clip } from "../../Mixin/Clip/Clip"
import { Propertied } from "../../Base/Propertied"
import { EditorDefinitions } from "../../Editor/EditorDefinitions"
import { isObject } from "../../Utility/Is"

export interface TrackObject extends UnknownObject {
  clips?: ClipObject[]
  dense?:  boolean
  layer?: number
  trackType?: TrackType
}

export interface TrackArgs extends TrackObject {
  definitions?: EditorDefinitions
}

export interface Track extends Propertied {
  addClip(clip: Clip, insertIndex?: number): void
  assureFrame(clips?: Clips): boolean
  assureFrames(quantize: number, clips?: Clips): boolean
  clips: Clips
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  identifier: string
  layer: number
  removeClip(clip: Clip): void
  sortClips(clips?: Clips): boolean
  trackType: TrackType
}

export type Tracks = Track[]

export const isTrack = (value?: any): value is Track => {
  return isObject(value) && "addClip" in value
}
