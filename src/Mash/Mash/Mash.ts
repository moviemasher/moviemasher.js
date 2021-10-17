import { Track, TrackObject } from "../Track"
import { Definition, DefinitionObject, DefinitionTimes } from "../Definition/Definition"
import { VisibleContext } from "../../Playing/VisibleContext"
import { Time } from "../../Utilities/Time"
import { Instance, InstanceObject } from "../Instance"
import { AudibleContext } from "../../Playing/AudibleContext"
import { GenericFactory, LoadPromise } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Clip } from "../Mixin/Clip/Clip"
import { Audible } from "../Mixin/Audible/Audible"
import { Action } from "../../Editing/Action/Action";
import { Composition } from "../../Playing/Composition";
import { Visible } from "../Mixin/Visible/Visible";
import { TrackRange } from "../../Utilities/TrackRange"
import { TimeRange } from "../../Utilities/TimeRange"

interface MashObject extends InstanceObject {
  audio? : TrackObject[]
  backcolor? : string
  id? : string
  label? : string
  media? : DefinitionObject[]
  quantize? : number
  video? : TrackObject[]
}

interface MashOptions extends MashObject {
  audibleContext? : AudibleContext
  buffer? : number
  gain? : number
  loop? : boolean
  time? : Time
  visibleContext? : VisibleContext
}

interface MashDefinition extends Definition {
  instance : Mash
  instanceFromObject(object : MashObject) : Mash
}

interface Mash extends Instance {
  addClipsToTrack(clips : Clip[], trackIndex? : number, insertIndex? : number) : void
  addTrack(trackType : TrackType) : Track
  audibleContext : AudibleContext
  audio: Track[]
  backcolor? : string
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clipTrack(clip: Clip): Track
  clips: Clip[]
  clipsVisibleSlice(frame: number, frames: number): Visible[]
  compositeVisible() : void
  composition : Composition
  definition : MashDefinition
  destroy() : void
  drawnTime? : Time
  duration : number
  endTime : Time
  handleAction(action : Action) : void
  load() : LoadPromise
  loadedDefinitions : DefinitionTimes
  loop : boolean
  media : Definition[]
  paused : boolean
  quantize : number
  removeClipsFromTrack(clips : Clip[]) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time) : LoadPromise
  time: Time
  timeRange: TimeRange
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
  video: Track[]
  visibleContext : VisibleContext
}

type MashDefinitionObject = DefinitionObject

type MashFactory = GenericFactory<Mash, MashObject, MashDefinition, MashDefinitionObject>

export { Mash, MashObject, MashOptions, MashFactory, MashDefinition, MashDefinitionObject }
