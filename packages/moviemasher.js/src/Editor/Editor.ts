import { IndexHandler, PreviewItems, StringObject } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { EditType, MasherAction } from "../Setup/Enums"
import { Edited } from "../Edited/Edited"
import { DataCastGetResponse, DataMashGetResponse, DataPutRequest } from "../Api/Data"
import { Mash, MashAndDefinitionsObject, MashAndMediaObject, Movable } from "../Edited/Mash/Mash"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Edited/Mash/Track/Track"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Layer, LayerAndPosition } from "../Edited/Cast/Layer/Layer"
import { Action } from "./Actions/Action/Action"
import { Clip, Clips } from "../Edited/Mash/Track/Clip/Clip"
import { Actions } from "./Actions/Actions"
import { EditorSelection } from "./EditorSelection"
import { isObject } from "../Utility/Is"
import { errorsThrow } from "../Utility/Errors"
import { Rect } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { Media, MediaObject, MediaObjects, Medias } from "../Media/Media"

export interface EditorIndex {
  layer?: number
  clip?: number
  track?: number
  effect?: number
}
export interface EditorArgs {
  autoplay: boolean
  buffer: number
  editType?: EditType
  baseUrl?: string
  edited?: EditedData
  fps: number
  loop: boolean
  precision: number
  readOnly?: boolean
  dimensions?: Rect | Size | undefined
  volume: number
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
  if (!isMashData(data)) errorsThrow(data, 'MashData', name)
}

export interface Editor {
  actions: Actions
  addFiles(files: File[], editorIndex?: EditorIndex): Promise<Media[]>
  addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>
  addMedia(object: MediaObject | MediaObjects, editorIndex?: EditorIndex): Promise<Media[]>
  addEffect: IndexHandler<Movable>
  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void
  addMash(mashAndMedia?: MashAndMediaObject, layerAndPosition?: LayerAndPosition): void
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  compose(mash: Mash, frame: number, frames: number): void
  create(): void
  currentTime: number
  dataPutRequest(): Promise<DataPutRequest>
  dragging: boolean
  definitions: Medias
  definitionsUnsaved: Medias
  duration: number
  readonly edited?: Edited
  editing: boolean
  editType: EditType
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  rect: Rect
  load(data: EditedData): Promise<void>
  loop: boolean
  move(object: ClipOrEffect, editorIndex?: EditorIndex): void
  moveClip(clip: Clip, editorIndex?: EditorIndex): void
  moveEffect: IndexHandler<Movable>
  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void
  muted: boolean
  pause(): void
  paused: boolean
  play(): void
  position: number
  positionStep: number
  precision: number
  readOnly: boolean
  redo(): void
  redraw(): void
  removeClip(clip: Clip): void
  removeEffect: IndexHandler<Movable>
  removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringObject): void
  readonly selection: EditorSelection
  svgElement: SVGSVGElement
  previewItems(enabled?: boolean): Promise<PreviewItems>
  time: Time
  timeRange: TimeRange
  undo(): void
  updateDefinition(definitionObject: MediaObject, definition?: Media): Promise<void> 
  volume: number
}
