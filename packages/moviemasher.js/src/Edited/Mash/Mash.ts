import {
  LoadPromise, UnknownObject, Value, FilterGraphs, Described, FilterGraphsArgs, Size, GraphFile, FilesOptions
} from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Definition } from "../../Base/Definition"
import { Time } from "../../Helpers/Time"
import { Clip } from "../../Mixin/Clip/Clip"
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
}

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
  graphFiles(args: FilesOptions): GraphFile[]
  filterGraphs(args: FilterGraphsArgs): FilterGraphs
  frame: number
  frames: number
  gain: number
  handleAction(action: Action): void
  // loadPromise: (timeOrRange: Time, avType?: AVType)=> LoadPromise
  // loadUrls: string[]
  // loadedDefinitions : DefinitionTimes
  loop: boolean
  paused: boolean
  preloader: Preloader
  quantize : number
  removeClipFromTrack(clip : Clip) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time): LoadPromise | undefined
  size(time?: Time): Size | undefined
  time: Time
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}

export { Mash, MashObject, MashDescription }
