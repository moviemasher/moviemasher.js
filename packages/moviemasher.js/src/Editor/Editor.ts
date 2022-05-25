import { Endpoint, LoadPromise, SelectedProperties, Size, StringObject, StringsObject, VisibleContextData, VisibleSources } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { DroppingPosition, EditType, MasherAction, SelectionType, SelectTypes, TrackType } from "../Setup/Enums"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse } from "../Api/Data"
import { EditorDefinitions } from "./EditorDefinitions"
import { Mash, MashAndDefinitionsObject, MashObject } from "../Edited/Mash/Mash"

import { Actions } from "./Actions/Actions"
import { Cast } from "../Edited/Cast/Cast"
import { DefinitionObject, DefinitionObjects } from "../Base/Definition"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Media/Track/Track"
import { Clip, Clips } from "../Mixin/Clip/Clip"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Layer, LayerAndPosition } from "../Edited/Cast/Layer/Layer"

export interface EditorArgs {
  autoplay: boolean
  buffer: number
  fps: number
  loop: boolean
  precision: number
  volume: number
  preloader?: BrowserPreloaderClass
  endpoint?: Endpoint
  editType?: EditType
}

export interface EditorOptions extends Partial<EditorArgs> { }

export interface SelectableObject extends Record<SelectionType, Selectable> {}

export interface Selection extends Partial<SelectableObject> {
  [SelectionType.Cast]?: Cast
  [SelectionType.Mash]?: Mash
  [SelectionType.Layer]?: Layer
  [SelectionType.Track]?: Track
  [SelectionType.Clip]?: Clip
  [SelectionType.Effect]?: Effect
}

export type ClipOrEffect = Clip | Effect

export type Selectable = Cast | Mash | Track | Layer | Clip | Effect

export interface CastData extends Partial<DataCastGetResponse> { }
export interface MashData extends Partial<DataMashGetResponse> { }
export type EditedData = CastData | MashData
export const isCastData = (data: EditedData): data is CastData => "cast" in data
export function assertMashData(data: EditedData): asserts data is MashData {
  if (!(data as MashData).mash) throw new Error('expected MashData')
}

export interface Editor {
  actions: Actions
  add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): Promise<ClipOrEffect>
  addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): LoadPromise
  addEffect(effect: Effect, insertIndex?: number): LoadPromise
  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void
  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void
  addTrack(trackType: TrackType): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  create(): void
  currentTime: number
  definitions: EditorDefinitions
  deselect(selectionType: SelectionType): void
  duration: number
  editType: EditType
  eventTarget: Emitter
  fps: number
  freeze(): void
  goToTime(value: Time): LoadPromise
  imageData: VisibleContextData
  imageSize: Size
  load(data: EditedData): void
  loop: boolean
  move(object: ClipOrEffect, frameOrIndex?: number, trackIndex?: number): void
  moveClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): void
  moveEffect(effect: Effect, index?: number): void
  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void
  muted: boolean
  pause(): void
  paused: boolean
  play(): void
  position: number
  positionStep: number
  precision: number
  preloader: BrowserPreloaderClass
  readonly edited?: Edited
  redo(): void
  remove(): void
  removeClip(clip: Clip): void
  removeEffect(effect: Effect): void
  removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  save(temporaryIdLookup?: StringObject): void
  select(selectable: Selectable): void
  selectedProperties(selectTypes?: SelectTypes): SelectedProperties
  readonly selection: Selection
  // selectTrack(track: Track | undefined): void
  split(): void
  time: Time
  timeRange: TimeRange
  undo(): void
  visibleSources: VisibleSources
  volume: number
}
