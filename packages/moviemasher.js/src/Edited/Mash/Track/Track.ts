import { UnknownObject, WithIndex } from "../../../declarations"
import { Clips, ClipObject, Clip } from "./Clip/Clip"
import { Propertied } from "../../../Base/Propertied"
import { isObject } from "../../../Utility/Is"
import { Mash } from "../Mash"
import { Selectable } from "../../../Editor/Selectable"
import { throwError } from "../../../Utility"

export interface TrackObject extends UnknownObject {
  clips?: ClipObject[]
  dense?:  boolean
  index?: number
}

export interface TrackArgs extends TrackObject {}

export interface Track extends Propertied, Selectable, WithIndex {
  addClips(clip: Clips, insertIndex?: number): void
  assureFrame(clips?: Clips): boolean
  assureFrames(quantize: number, clips?: Clips): void
  clips: Clips
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  identifier: string
  mash: Mash
  removeClips(clip: Clips): void
  sortClips(clips?: Clips): boolean
}
export const isTrack = (value?: any): value is Track => {
  return isObject(value) && "frameForClipNearFrame" in value
}
export function assertTrack(value: any, name?: string): asserts value is Track {
  if (!isTrack(value)) throwError(value, 'Track', name)
}

export type Tracks = Track[]
