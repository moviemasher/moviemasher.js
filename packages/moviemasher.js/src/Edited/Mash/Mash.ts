import {
  SegmentsPromise, LoadPromise, UnknownObject, Value, SegmentArgs, Segments
} from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Definition, DefinitionTimes } from "../../Base/Definition"
import { Time } from "../../Helpers/Time"
import { Clip } from "../../Mixin/Clip/Clip"
import { Audible } from "../../Mixin/Audible/Audible"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Composition } from "../../Editor/MashEditor/Composition"
import { Visible } from "../../Mixin/Visible/Visible"
import { TimeRange } from "../../Helpers/TimeRange"
import { Edited } from "../../Edited/Edited"
import { Track, TrackObject } from "../../Media/Track/Track"

interface MashOptions extends UnknownObject {
  backcolor : string
  id? : string
  label: string
  buffer?: number
  gain?: Value
  quantize : number
  tracks?: TrackObject[]
  createdAt?: string
}

type MashObject = Partial<MashOptions>

interface Mash extends Edited {
  addClipToTrack(clip : Clip, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(trackType: TrackType): Track

  /**
   * @defaultValue {@link MashDefaults}.backcolor
   * @example
   * ```
   * mash.backcolor = 'red'
   * ```
   */
  backcolor: string
  buffer: number
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clipTrack(clip: Clip): Track
  clips: Clip[]
  clipsVisible(start: Time, end?: Time): Visible[]
  compositeVisible() : void
  composition : Composition
  definitions : Definition[]
  destroy() : void
  drawnTime? : Time
  duration: number
  endTime: Time
  frame: number
  frames: number
  gain: number
  handleAction(action: Action): void
  id: string
  loadPromise?: LoadPromise
  loadUrls: string[]
  loadedDefinitions : DefinitionTimes
  loop: boolean
  paused : boolean
  quantize : number
  removeClipFromTrack(clip : Clip) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time) : LoadPromise | undefined
  segments(args: SegmentArgs): Segments
  segmentsPromise(args: SegmentArgs): SegmentsPromise
  time: Time
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}

export { Mash, MashObject, MashOptions }
