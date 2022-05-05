import {
  LoadPromise, UnknownObject, Value, Described, GraphFiles
} from "../../declarations"
import { AVType, TrackType } from "../../Setup/Enums"
import { Definition } from "../../Base/Definition"
import { Time } from "../../Helpers/Time/Time"
import { Clip, Clips } from "../../Mixin/Clip/Clip"
import { Audible, AudibleContent } from "../../Mixin/Audible/Audible"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Composition } from "./Composition/Composition"
import { TimeRange } from "../../Helpers/Time/Time"
import { Edited } from "../../Edited/Edited"
import { Track, TrackObject } from "../../Media/Track/Track"
import { Preloader } from "../../Preloader/Preloader"
import { FilterGraphObject, FilterGraphOptions } from "./FilterGraph/FilterGraph"
import { TransformableContent } from "../../Mixin/Transformable/Transformable"
import { FilterGraphs } from "./FilterGraphs/FilterGraphs"
import { EditorDefinitions } from "../../Editor/EditorDefinitions"

export interface MashDescription extends UnknownObject, Described {}
export interface MashObject extends Partial<MashDescription> {
  backcolor? : string
  buffer?: number
  gain?: Value
  quantize? : number
  tracks?: TrackObject[]
  frame?: number
  rendering?: string
}

export interface MashArgs extends MashObject {
  definitions?: EditorDefinitions
}
export type Content = TransformableContent & AudibleContent
export type Contents = Content[]

export interface Mash extends Edited {
  addClipToTrack(clip : Clip, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(trackType: TrackType): Track
  backcolor: string
  buffer: number
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clips: Clips
  clipsInTimeOfType(time: Time, avType?: AVType): Clip[]
  clipTrack(clip: Clip): Track
  composition: Composition
  contents(time: Time, avType?: AVType): Contents
  // definitions : Definition[]
  destroy() : void
  draw() : void
  drawnTime? : Time
  duration: number
  endTime: Time
  filterGraphs(args: FilterGraphOptions): FilterGraphs
  frame: number
  frames: number
  gain: number
  graphFiles(args: FilterGraphOptions): GraphFiles
  handleAction(action: Action): void
  loop: boolean
  paused: boolean
  preloader: Preloader
  loadPromise(args?: FilterGraphObject): LoadPromise
  quantize : number
  removeClipFromTrack(clip : Clip) : void
  removeTrack(trackType: TrackType): void
  rendering: string
  seekToTime(time: Time): LoadPromise | undefined
  time: Time
  /** this.time -> this.endTime in time's fps */
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}
