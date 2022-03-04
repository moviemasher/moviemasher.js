import {
  LoadPromise, UnknownObject, Value, FilterGraphs, Described, FilterGraphOptions, FilesOptions, GraphFiles
} from "../../declarations"
import { AVType, TrackType } from "../../Setup/Enums"
import { Definition } from "../../Base/Definition"
import { Time } from "../../Helpers/Time"
import { Clip, Clips } from "../../Mixin/Clip/Clip"
import { Audible } from "../../Mixin/Audible/Audible"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Composition } from "../../Editor/MashEditor/Composition"
import { Visible } from "../../Mixin/Visible/Visible"
import { TimeRange } from "../../Helpers/TimeRange"
import { Edited } from "../../Edited/Edited"
import { Track, TrackObject } from "../../Media/Track/Track"
import { Preloader } from "../../Preloader/Preloader"

interface MashDescription extends UnknownObject, Described {}
interface MashObject extends Partial<MashDescription> {
  backcolor? : string
  buffer?: number
  gain?: Value
  quantize? : number
  tracks?: TrackObject[]
  frame?: number
}

export interface MashArgs extends MashObject {
  definitions: Definition[]
}

interface Mash extends Edited {
  addClipToTrack(clip : Clip, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(trackType: TrackType): Track
  backcolor: string
  buffer: number
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clips: Clips
  clipsInTimeRange(timeRange?: TimeRange, avType?: AVType): Clip[]
  clipsVisible(start: Time, end?: Time): Visible[]
  clipTrack(clip: Clip): Track
  composition : Composition
  definitions : Definition[]
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
  quantize : number
  removeClipFromTrack(clip : Clip) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time): LoadPromise | undefined
  time: Time
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}

export { Mash, MashObject, MashDescription }
