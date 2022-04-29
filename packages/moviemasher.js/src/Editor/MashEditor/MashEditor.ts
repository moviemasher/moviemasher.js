import { LoadPromise, SelectedProperties } from "../../declarations"
import { Clip, Clips } from "../../Mixin/Clip/Clip"
import { DefinitionObject } from "../../Base/Definition"
import { Effect } from "../../Media/Effect/Effect"
import { MasherAction, TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Track } from "../../Media/Track/Track"
import { Editor, EditorOptions } from "../Editor"
import { Mash } from "../../Edited/Mash/Mash"

interface MashEditorSelection {
  track?: Track
  clip?: Clip
  effect?: Effect
}

interface MashEditorOptions extends EditorOptions {
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
  autoplay: boolean
  buffer: number
  can(masherAction : MasherAction) : boolean
  clips: Clips
  currentTime : number
  duration: number
  fps : number
  freeze() : void
  goToTime(value: Time): LoadPromise
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
  save(id?: string) : void
  selectClip(clip : Clip | undefined) : void
  selectEffect(effect : Effect | undefined) : void
  selectTrack(track: Track | undefined): void
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
