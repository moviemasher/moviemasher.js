import { Endpoint, StringObject } from "../declarations"
import { Size } from "../Utility/Size"
import { EffectAddHandler, EffectMoveHandler, EffectRemovehandler } from "../Utility/SelectedProperty"
import { Emitter } from "../Helpers/Emitter"
import { DroppingPosition, EditType, MasherAction } from "../Setup/Enums"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse, DataPutRequest } from "../Api/Data"
import { MashAndDefinitionsObject } from "../Edited/Mash/Mash"

import { Definition, DefinitionObject, DefinitionObjects } from "../Definition/Definition"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Edited/Mash/Track/Track"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Layer, LayerAndPosition } from "../Edited/Cast/Layer/Layer"
import { Action } from "./Actions/Action/Action"
import { Clip, Clips } from "../Edited/Mash/Track/Clip/Clip"
import { Svgs } from "./Preview/Preview"
import { Actions } from "./Actions/Actions"
import { EditorSelection } from "./EditorSelection"
import { isObject } from "../Utility/Is"
import { throwError } from "../Utility/Throw"

export interface EditorIndex {
  layer?: number
  clip?: number
  track?: number
  effect?: number
}
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
export const isCastData = (data: EditedData): data is CastData => (
  isObject(data) && "cast" in data
)
export const isMashData = (data: EditedData): data is CastData => (
  isObject(data) && "mash" in data
)
export function assertMashData(data: EditedData, name?: string): asserts data is MashData {
  if (!isMashData(data)) throwError(data, 'MashData', name)
}

export interface Editor {
  actions: Actions
  add(object: DefinitionObject | DefinitionObjects, editorIndex?: EditorIndex): Promise<Definition[]>
  addFiles(files: File[], editorIndex?: EditorIndex): Promise<Definition[]>
  addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>
  addEffect: EffectAddHandler
  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void
  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  create(): void
  currentTime: number
  dataPutRequest(): Promise<DataPutRequest>
  definitions: Definition[]
  definitionsUnsaved: Definition[]
  duration: number
  editing: boolean
  editType: EditType
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  imageSize: Size
  load(data: EditedData): Promise<void>
  loop: boolean
  move(object: ClipOrEffect, editorIndex?: EditorIndex): void
  moveClip(clip: Clip, editorIndex?: EditorIndex): void
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
  readOnly: boolean
  redo(): void
  removeClip(clip: Clip): void
  removeEffect: EffectRemovehandler
  removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringObject): void
  svgs: Promise<Svgs>
  time: Time
  timeRange: TimeRange
  undo(): void
  volume: number
}
