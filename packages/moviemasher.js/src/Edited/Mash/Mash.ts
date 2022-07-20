import {
  UnknownObject, Value, Described} from "../../declarations"
import { AVType, DefinitionType, TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { Clip } from "../../Mixin/Clip/Clip"
import { AudioPreview } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { TimeRange } from "../../Helpers/Time/Time"
import { Edited, EditedArgs, EditedObject } from "../../Edited/Edited"
import { Track, TrackObject } from "./Track/Track"
import { Loader } from "../../Loader/Loader"
import { FilterGraphsOptions } from "./FilterGraphs/FilterGraphs"
import { FilterGraphs } from "./FilterGraphs/FilterGraphs"
import { DefinitionObjects } from "../../Definition/Definition"
import { isObject } from "../../Utility/Is"
import { VisibleClip } from "../../Media/VisibleClip/VisibleClip"

export interface DefinitionReferenceObject {
  definitionId: string
  definitionType: DefinitionType
  label: string
}
export interface MashDescription extends UnknownObject, Described {}

export interface MashObject extends EditedObject {
  definitionReferences?: DefinitionReferenceObjects
  gain?: Value
  tracks?: TrackObject[]
  frame?: number
  rendering?: string
}

export type DefinitionReferenceObjects = DefinitionReferenceObject[]

export interface MashAndDefinitionsObject {
  mashObject: MashObject
  definitionObjects: DefinitionObjects
}

export interface MashArgs extends EditedArgs, MashObject { }

export interface Mash extends Edited {
  addClipToTrack(clip : Clip, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(trackType: TrackType): Track
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : VisibleClip, value : number, frames : number) : void
  clips: VisibleClip[]
  clipsInTimeOfType(time: Time, avType?: AVType): VisibleClip[]
  clipTrack(clip: Clip): Track
  composition: AudioPreview
  definitionIds: string[]
  draw() : void
  drawnTime? : Time
  duration: number
  endTime: Time
  filterGraphs(args?: FilterGraphsOptions): FilterGraphs
  frame: number
  frames: number
  gain: number
  loop: boolean
  paused: boolean
  preloader: Loader
  quantize : number
  removeClipFromTrack(clip : Clip) : void
  removeTrack(trackType: TrackType): void
  rendering: string
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  /** this.time -> this.endTime in time's fps */
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}

export type Mashes = Mash[]


export const isMash = (value: any): value is Mash => {
  return isObject(value) && "trackOfTypeAtIndex" in value
}

export function assertMash(value: any): asserts value is Mash {
  if (!isMash(value)) throw new Error("expected Mash")
}
