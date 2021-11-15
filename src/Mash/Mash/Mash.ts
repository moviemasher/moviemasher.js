import { Track, TrackObject } from "../Track"
import { Definition, DefinitionObject, DefinitionTimes } from "../Definition/Definition"
import { Time } from "../../Utilities/Time"
import { Instance, InstanceObject } from "../Instance"
import { GenericFactory, InputCommandPromise, LoadPromise } from "../../declarations"
import { CommandType, TrackType } from "../../Setup/Enums"
import { Clip } from "../Mixin/Clip/Clip"
import { Audible } from "../Mixin/Audible/Audible"
import { Action } from "../../Editing/Action/Action"
import { Composition } from "../../Playing/Composition"
import { Visible } from "../Mixin/Visible/Visible"
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
  buffer? : number
  gain? : number
  loop? : boolean
  time? : Time
}

interface MashDefinition extends Definition {
  instance : Mash
  instanceFromObject(object : MashObject) : Mash
}

interface Mash extends Instance {
  addClipsToTrack(clips : Clip[], trackIndex? : number, insertIndex? : number, frames? : number[]) : void
  addTrack(trackType : TrackType) : Track
  audio: Track[]
  backcolor? : string
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clipTrack(clip: Clip): Track
  clips: Clip[]
  clipsVisible(start: Time, end?: Time): Visible[]
  inputCommandPromise(type: CommandType, start: Time, end?: Time): InputCommandPromise
  compositeVisible() : void
  composition : Composition
  definition : MashDefinition
  destroy() : void
  drawnTime? : Time
  duration : number
  endTime: Time
  frame: number
  frames: number
  handleAction(action : Action) : void
  loadPromise?: LoadPromise
  loadUrls: string[]
  loadedDefinitions : DefinitionTimes
  loop : boolean
  media : Definition[]
  paused : boolean
  quantize : number
  removeClipsFromTrack(clips : Clip[]) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time) : LoadPromise | undefined
  time: Time
  timeRange: TimeRange
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
  video: Track[]
}

type MashDefinitionObject = DefinitionObject

type MashFactory = GenericFactory<Mash, MashObject, MashDefinition, MashDefinitionObject>

export { Mash, MashObject, MashOptions, MashFactory, MashDefinition, MashDefinitionObject }
