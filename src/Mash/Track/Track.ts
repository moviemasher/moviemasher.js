
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
  addClips(clips : Clip[], insertIndex?: number) : void
  clips: Clip[]
  dense: boolean
  frameForClipsNearFrame(clips: Clip[], frame?: number): number
  frames: number
  layer: number
  removeClips(clips: Clip[]): void
  sortClips(clips: Clip[]): void
  trackType: TrackType
}

export { Track, TrackObject }
