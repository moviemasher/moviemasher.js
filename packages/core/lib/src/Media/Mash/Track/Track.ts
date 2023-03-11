import { UnknownRecord } from "../../../Types/Core"
import { Indexed } from "../../../Base/Base"
import { Clips, ClipObject, Clip } from "./Clip/Clip"
import { Propertied } from "../../../Base/Propertied"
import { isObject } from "../../../Utility/Is"
import { MashMedia } from "../Mash"
import { errorThrow } from "../../../Helpers/Error/ErrorFunctions"
import { Selectable } from "../../../Plugin/Masher/Selectable"

export interface TrackObject extends UnknownRecord {
  clips?: ClipObject[]
  dense?:  boolean
  index?: number
}

export interface TrackArgs extends TrackObject {
  mashMedia: MashMedia
}

export interface Track extends Propertied, Selectable, Indexed {
  addClips(clip: Clips, insertIndex?: number): void
  assureFrame(clips?: Clips): boolean
  assureFrames(quantize: number, clips?: Clips): void
  clips: Clips
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  identifier: string
  mash: MashMedia
  removeClips(clip: Clips): void
  sortClips(clips?: Clips): boolean
}
export const isTrack = (value?: any): value is Track => {
  return isObject(value) && "frameForClipNearFrame" in value
}
export function assertTrack(value: any, name?: string): asserts value is Track {
  if (!isTrack(value)) errorThrow(value, 'Track', name)
}

export type Tracks = Track[]
