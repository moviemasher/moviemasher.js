import { LoadPromise, UnknownObject } from "../../declarations"
import { Clip } from "../../Mixin/Clip/Clip"
import { DefinitionObject, DefinitionTimes } from "../../Base/Definition"
import { Effect } from "../../Media/Effect/Effect"
import { MasherAction, TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { TimeRange } from "../../Helpers/TimeRange"
import { Track } from "../../Media/Track/Track"
import { Editor } from "../Editor"
import { Mash } from "../../Edited/Mash/Mash"

interface MashEditorSelection {
  track?: Track
  clip?: Clip
  effect?: Effect
}

interface MashEditorOptions extends UnknownObject {
  autoplay: boolean
  buffer: number
  fps: number
  loop: boolean
  mash? : Mash
  precision: number
  volume: number
}

interface MashEditorObject extends Partial<MashEditorOptions> {}

type ClipOrEffect = Clip | Effect

interface MashEditor extends Editor {
  add(object : DefinitionObject, frameOrIndex? : number, trackIndex? : number) : Promise<ClipOrEffect>
  addClip(clip : Clip, frameOrIndex? : number, trackIndex? : number) : LoadPromise
  addEffect(effect : Effect, insertIndex? : number) : LoadPromise
  addTrack(trackType: TrackType): void

  /**
   * When true, [[`paused`]] is set to false whenever [[`mash`]] is changed.
   */
  autoplay: boolean

  /**
   * Number of seconds to preload before playing.
   */
  buffer: number

  /**
   * @param masherAction
   * @returns True when `masherAction` can be taken, given the current selection.
   */
  can(masherAction : MasherAction) : boolean
  clips: Clip[]
  currentTime : number
  duration: number
  fps : number
  freeze() : void
  goToTime(value: Time): LoadPromise
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
  selection: MashEditorSelection
  split() : void
  time: Time
  timeRange : TimeRange
  undo() : void
  volume : number
}

export {
  ClipOrEffect,
  MashEditor,
  MashEditorObject,
  MashEditorOptions,
  MashEditorSelection,
}
