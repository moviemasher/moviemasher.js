import { Endpoint, StringObject, VisibleContextData } from "../declarations"
import { Size } from "../Utility/Size"
import { SelectedProperties } from "../MoveMe"
import { Emitter } from "../Helpers/Emitter"
import { EditType, MasherAction, SelectType, TrackType } from "../Setup/Enums"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse, DataPutRequest } from "../Api/Data"
import { Mash, MashAndDefinitionsObject } from "../Edited/Mash/Mash"

import { Cast } from "../Edited/Cast/Cast"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Edited/Mash/Track/Track"
import { Clip, Clips } from "../Mixin/Clip/Clip"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Layer, LayerAndPosition } from "../Edited/Cast/Layer/Layer"
import { Action } from "./Actions/Action/Action"
import { VisibleClip } from "../Media/VisibleClip/VisibleClip"
import { Svgs } from "./Preview/Preview"

export interface EditorArgs {
  autoplay: boolean
  buffer: number
  readOnly?: boolean
  fps: number
  loop: boolean
  precision: number
  volume: number
  preloader?: BrowserLoaderClass
  endpoint?: Endpoint
  editType?: EditType
}

export interface EditorOptions extends Partial<EditorArgs> { }

export interface SelectableObject extends Record<SelectType, Selectable> {}

export interface EditorSelection extends Partial<SelectableObject> {
  [SelectType.Cast]?: Cast
  [SelectType.Mash]?: Mash
  [SelectType.Layer]?: Layer
  [SelectType.Track]?: Track
  [SelectType.Clip]?: Clip
  [SelectType.Effect]?: Effect
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
  add(object: DefinitionObject, frameOrIndex?: number, trackIndex?: number): Promise<ClipOrEffect>
  addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): Promise<void>
  addEffect(effect: Effect, insertIndex?: number): Promise<void>
  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void
  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void
  addTrack(trackType: TrackType): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  create(): void
  currentTime: number
  dataPutRequest(): Promise<DataPutRequest>
  definitions: Definition[]
  deselect(selectionType: SelectType): void
  duration: number
  readOnly: boolean
  editing: boolean
  editType: EditType
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  imageSize: Size
  load(data: EditedData): Promise<void>
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
  preloader: BrowserLoaderClass
  readonly edited?: Edited
  readonly selection: EditorSelection
  redo(): void
  remove(): void
  removeClip(clip: Clip): void
  removeEffect(effect: Effect): void
  removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringObject): void
  select(selectable: Selectable): void
  selectedProperties(selectTypes?: SelectType[]): SelectedProperties
  svgs: Svgs
  time: Time
  timeRange: TimeRange
  undo(): void
  volume: number
}
