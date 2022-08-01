import { Endpoint, StringObject, VisibleContextData } from "../declarations"
import { Size } from "../Utility/Size"
import { EffectAddHandler, EffectMoveHandler, EffectRemovehandler, SelectedItems } from "../Utility/SelectedProperty"
import { Emitter } from "../Helpers/Emitter"
import { EditType, MasherAction, SelectType, TrackType } from "../Setup/Enums"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse, DataPutRequest } from "../Api/Data"
import { MashAndDefinitionsObject } from "../Edited/Mash/Mash"

import { Definition, DefinitionObject } from "../Definition/Definition"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Edited/Mash/Track/Track"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Layer, LayerAndPosition } from "../Edited/Cast/Layer/Layer"
import { Action } from "./Actions/Action/Action"
import { Clip, Clips } from "../Media/Clip/Clip"
import { Svgs } from "./Preview/Preview"
import { Actions } from "./Actions/Actions"
import { EditorSelection, Selectable } from "./Selectable"

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


export type ClipOrEffect = Clip | Effect

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
  addClip(clip: Clip, frameOrIndex?: number, trackIndex?: number): Promise<void>
  addEffect: EffectAddHandler
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
  moveEffect: EffectMoveHandler
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
  removeClip(clip: Clip): void
  removeEffect: EffectRemovehandler
  removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringObject): void
  select(selectable: Selectable): void
  selectTypes: SelectType[]
  selectedItems(selectTypes?: SelectType[]): SelectedItems
  svgs: Promise<Svgs>
  time: Time
  timeRange: TimeRange
  undo(): void
  volume: number
}
