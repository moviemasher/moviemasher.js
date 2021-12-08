
import { UnknownObject } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Propertied } from "../../Setup/Property"
import { Clip, ClipObject } from "../../Mixin/Clip/Clip"

interface TrackObject extends UnknownObject {
  clips?: ClipObject[]
  dense?:  boolean
  id?: string
  layer?: number
  trackType?: TrackType
}

interface Track extends Propertied {
  addClip(clip : Clip, insertIndex?: number) : void
  clips: Clip[]
  dense: boolean
  frameForClipNearFrame(clip: Clip, frame?: number): number
  frames: number
  layer: number
  removeClip(clip: Clip): void
  sortClips(clips: Clip[]): void
  trackType: TrackType
}

export { Track, TrackObject }
