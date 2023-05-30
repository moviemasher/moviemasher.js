import type {UnknownRecord} from '@moviemasher/runtime-shared'

import type { ClipObject } from "../Clip/ClipObject.js"
import type { Clips } from '../Clip/Clip.js'
import type { Indexed } from '../../../Base/Base.js'
import type { MashAsset } from '../MashTypes.js'
import type { Propertied } from '@moviemasher/runtime-shared'

export interface TrackObject extends UnknownRecord {
  clips?: ClipObject[]
  dense?:  boolean
  index?: number
}

export interface TrackArgs extends TrackObject {
  mashAsset: MashAsset
}

export interface Track extends Propertied, Indexed {
  assureFrames(quantize: number, clips?: Clips): void
  clips: Clips
  dense: boolean
  frames: number
  identifier: string
  mash: MashAsset
  sortClips(clips?: Clips): boolean
}

export type Tracks = Track[]
