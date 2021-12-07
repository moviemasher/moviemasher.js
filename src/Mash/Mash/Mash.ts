import { Track, TrackObject } from "../Track"
import { Definition, DefinitionObject, DefinitionTimes } from "../../Base/Definition"
import { Time } from "../../Utilities/Time"
import { InputCommandsPromise, LoadPromise, MashState, MashStatePromise, Size } from "../../declarations"
import { CommandType, TrackType } from "../../Setup/Enums"
import { Clip } from "../../Mixin/Clip/Clip"
import { Audible } from "../../Mixin/Audible/Audible"
import { Action } from "../../Editing/Action/Action"
import { Composition } from "../../Playing/Composition"
import { Visible } from "../../Mixin/Visible/Visible"
import { TimeRange } from "../../Utilities/TimeRange"
import { Emitter } from "../../Utilities/Emitter"
import { UnknownObject } from "../../declarations"
import { Job } from "../../Job/Job"

interface MashObject extends UnknownObject {
  backcolor? : string
  id? : string
  label? : string
  quantize? : number
  tracks?: TrackObject[]
  createdAt?: string
}

interface Mash {
  addClipsToTrack(clips : Clip[], trackIndex? : number, insertIndex? : number, frames? : number[]) : void
  addTrack(trackType : TrackType) : Track
  backcolor?: string
  buffer: number
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clipTrack(clip: Clip): Track
  clips: Clip[]
  clipsVisible(start: Time, end?: Time): Visible[]
  inputCommandPromise(type: CommandType, size: Size, start: Time, end?: Time): InputCommandsPromise
  compositeVisible() : void
  composition : Composition
  definitions : Definition[]
  destroy() : void
  drawnTime? : Time
  duration: number
  emitter?: Emitter
  endTime: Time
  frame: number
  frames: number
  gain: number
  handleAction(action: Action): void
  id: string
  job: Job
  loadPromise?: LoadPromise
  loadUrls: string[]
  loadedDefinitions : DefinitionTimes
  loop: boolean
  mashState(time:Time, dimensions:Size): MashState
  mashStatePromise(time:Time, dimensions:Size): MashStatePromise
  paused : boolean
  quantize : number
  removeClipsFromTrack(clips : Clip[]) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time) : LoadPromise | undefined
  time: Time
  timeRange: TimeRange
  toJSON(): UnknownObject
  trackCount(type?: TrackType): number
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
}

export { Mash, MashObject }
