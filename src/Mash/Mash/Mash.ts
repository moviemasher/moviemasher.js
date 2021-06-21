import { Track, TrackObject } from "../Track"
import { Definition, DefinitionObject, DefinitionTimes } from "../Definition/Definition"
import { VisibleContext } from "../../Playing/VisibleContext"
import { Events } from "../../Editing/Events/Events"
import { Time } from "../../Utilities/Time"
import { Instance, InstanceObject } from "../Instance"
import { AudibleContext } from "../../Playing/AudibleContext"
import { GenericFactory, LoadPromise } from "../../Setup/declarations"
import { TrackType } from "../../Setup/Enums"
import { Clip } from "../Mixin/Clip/Clip"
import { Audible } from "../Mixin/Audible/Audible"

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
  events? : Events
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
  audio: Track[]
  backcolor? : string
  duration : number
  endTime : Time
  events : Events
  changeClipFrames(clip : Clip, value : number) : void
  changeClipTrimAndFrames(clip : Audible, value : number, frames : number) : void
  clipTrack(clip : Clip) : Track
  clipsInTracks : Clip[]
  compositeVisible() : void
  definition : MashDefinition
  destroy() : void
  load() : LoadPromise
  loadedDefinitions : DefinitionTimes
  loop : boolean
  media : Definition[]
  paused : boolean
  quantize : number
  removeClipsFromTrack(clips : Clip[]) : void
  removeTrack(trackType : TrackType) : void
  seekToTime(time: Time) : LoadPromise
  time : Time
  trackOfTypeAtIndex(type : TrackType, index? : number) : Track
  tracks: Track[]
  video: Track[]
}

type MashDefinitionObject = DefinitionObject

type MashFactory = GenericFactory<Mash, MashObject, MashDefinition, MashDefinitionObject>

export { Mash, MashObject, MashOptions, MashFactory, MashDefinition, MashDefinitionObject }
