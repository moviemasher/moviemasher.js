import { Indexed } from './Base.js'
import { Clips } from './Clip.js'
import { ClipObject } from './ClipObject.js'
import { UnknownRecord } from './Core.js'
import { MashAsset } from './MashTypes.js'
import { Propertied } from './Propertied.js'

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
