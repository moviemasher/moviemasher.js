import {
  ContextData, LoadPromise, MasherChangeHandler,
  SelectionValue, Size, UnknownObject
} from "../declarations"
import { Mash } from "../Mash/Mash/Mash"
import { Clip } from "../Mixin/Clip/Clip"
import { DefinitionObject, DefinitionTimes } from "../Base/Definition"
import { Effect } from "../Mash/Effect/Effect"
import { MoveType, TrackType } from "../Setup/Enums"
import { Time } from "../Utilities/Time"
import { TimeRange } from "../Utilities/TimeRange"
import { Track } from "../Mash/Track/Track"


interface Selection {
  track?: Track
  clip?: Clip
  effect?: Effect
}

interface MasherObject extends UnknownObject {
  autoplay?: boolean
  buffer?: number
  fps?: number
  loop?: boolean
  mash? : Mash
  precision?: number
  volume?: number
}

type ClipOrEffect = Clip | Effect

type MasherAddPromise = Promise<ClipOrEffect>

interface Masher extends UnknownObject {
  add(object : DefinitionObject, frameOrIndex? : number, trackIndex? : number) : MasherAddPromise
  addClip(clip : Clip, frameOrIndex? : number, trackIndex? : number) : LoadPromise
  addEffect(effect : Effect, insertIndex? : number) : LoadPromise
  addTrack(trackType : TrackType) : void
  autoplay : boolean
  buffer : number
  can(method : string) : boolean
  change: MasherChangeHandler
  changeClip(property : string, value? : SelectionValue, clip? : Clip) : void
  changeEffect(property : string, value? : SelectionValue, effect? : Effect) : void
  clips: Clip[]
  currentTime : number
  duration: number
  eventTarget: EventTarget
  fps : number
  freeze() : void
  goToTime(value: Time): LoadPromise
  imageData: ContextData
  imageSize : Size
  loadedDefinitions : DefinitionTimes
  loop : boolean
  mash : Mash
  move(object: ClipOrEffect, frameOrIndex? : number, trackIndex? : number) : void
  moveClip(clip: Clip, frameOrIndex? : number, trackIndex? : number) : void
  moveEffect(effect: Effect, index? : number) : void
  muted : boolean
  pause() : void
  paused : boolean
  play() : void
  position : number
  positionStep : number
  precision : number
  redo() : void
  remove() : void
  removeClip(clip: Clip) : void
  removeEffect(effect: Effect): void
  removeTrack(track: Track): void
  save() : void
  selectClip(clip : Clip | undefined) : void
  selectEffect(effect : Effect | undefined) : void
  selectTrack(track : Track | undefined) : void
  selection: Selection
  split() : void
  time: Time
  timeRange : TimeRange
  undo() : void
  volume : number
}

export { Masher, MasherObject, MasherAddPromise, ClipOrEffect, Selection }
