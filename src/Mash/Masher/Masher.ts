import { Context2D, ContextElement, DrawingSource, GenericFactory, LoadPromise, SelectionObject, SelectionValue, UnknownObject } from "../../declarations"
import { Mash } from "../Mash/Mash"
import { Clip } from "../Mixin/Clip/Clip"
import { AudibleContext, VisibleContext } from "../../Playing"
import { Definition, DefinitionObject, DefinitionTimes } from "../Definition/Definition"
import { Effect } from "../Effect/Effect"
import { Instance, InstanceObject } from "../Instance"
import { MoveType, TrackType } from "../../Setup/Enums"
import { Time, TimeRange, TrackRange } from "../../Utilities"


interface MasherObject extends InstanceObject {
  audibleContext? : AudibleContext
  autoplay?: boolean
  buffer?: number
  canvas? : ContextElement
  fps?: number
  loop?: boolean
  mash? : Mash
  precision?: number
  volume?: number
}

type ClipOrEffect = Clip | Effect

type MasherAddPromise = Promise<ClipOrEffect>

interface Masher extends Instance {
  add(object : DefinitionObject, frameOrIndex? : number, trackIndex? : number) : MasherAddPromise
  addClip(clip : Clip, frameOrIndex? : number, trackIndex? : number) : LoadPromise
  addEffect(effect : Effect, insertIndex? : number) : LoadPromise
  addTrack(trackType : TrackType) : void
  audibleContext : AudibleContext
  autoplay : boolean
  buffer : number
  can(method : string) : boolean
  canvas : ContextElement
  change(property : string, value? : SelectionValue) : void
  changeClip(property : string, value? : SelectionValue, clip? : Clip) : void
  changeEffect(property : string, value? : SelectionValue, effect? : Effect) : void
  changeMash(property: string, value?: SelectionValue): void
  clips: Clip[]
  currentTime : number
  definitions : Definition[]
  destroy() : void
  draw() : void
  duration : number
  fps : number
  // frame : number
  // frames : number
  freeze() : void
  goToTime(value : Time) : LoadPromise
  isSelected(object : ClipOrEffect) : boolean
  loadedDefinitions : DefinitionTimes
  loop : boolean
  mash : Mash
  move(objectOrArray : ClipOrEffect | ClipOrEffect[], moveType : MoveType, frameOrIndex? : number, trackIndex? : number) : void
  moveClips(clipOrArray : Clip | Clip[], frameOrIndex? : number, trackIndex? : number) : void
  moveEffects(effectOrArray : Effect | Effect[], index? : number) : void
  muted : boolean
  pause() : void
  paused : boolean
  play() : void
  position : number
  positionStep : number
  precision : number
  redo() : void
  remove(objectOrArray : ClipOrEffect | ClipOrEffect[], moveType : MoveType) : void
  removeClips(clipOrArray : Clip | Clip[]) : void
  removeEffects(effectOrArray : Effect | Effect[]) : void
  save() : void
  select(object : ClipOrEffect | undefined, toggleSelected? : boolean) : void
  selectClip(clip : Clip | undefined, toggleSelected? : boolean) : void
  selectEffect(effect : Effect | undefined, toggleSelected? : boolean) : void
  selectMash() : void
  selectedClipsOrEffects : Clip[] | Effect[]
  selectedClip : Clip | UnknownObject
  selectedClipOrMash : Clip | Mash
  selectedClips : Clip[]
  selectedEffect : Effect | UnknownObject
  selectedEffects : Effect[]
  selectionObjects : SelectionObject[]
  split() : void
  time: Time
  timeRange : TimeRange
  undo() : void
  visibleContext : VisibleContext // for tests
  volume : number
}

interface MasherDefinition extends Definition {
  instance : Masher
  instanceFromObject(object : MasherObject) : Masher
}

type MasherDefinitionObject = DefinitionObject

interface MasherFactory extends GenericFactory<Masher, MasherObject, MasherDefinition, MasherDefinitionObject> {
  destroy(masher : Masher) : void
  instance(object? : MasherObject) : Masher
}

export { Masher, MasherFactory, MasherDefinition, MasherObject, MasherDefinitionObject, MasherAddPromise, ClipOrEffect }
