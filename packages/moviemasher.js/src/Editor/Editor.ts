import { StringRecord } from "../declarations"
import { IndexHandler } from "../Helpers/Select/Select"
import { PreviewItems } from "../Helpers/Svg/Svg"
import { Emitter } from "../Helpers/Emitter"
import { EditType, MasherAction } from "../Setup/Enums"
import { DataMashGetResponse } from "../Api/Data"
import { isMashAndMediaObject, MashMedia, Movable, MashMediaObject } from "../Media/Mash/Mash"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Media/Mash/Track/Track"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Action } from "./Actions/Action/Action"
import { Clip, Clips } from "../Media/Mash/Track/Clip/Clip"
import { Actions } from "./Actions/Actions"
import { EditorSelection } from "./EditorSelection"
import { isObject } from "../Utility/Is"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { Rect } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { Media, MediaObject, MediaObjects, MediaArray } from "../Media/Media"
import { MediaCollection } from "../Base/MediaCollection"

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
  mash?: MashMediaObject
  fps: number
  loop: boolean
  precision: number
  readOnly?: boolean
  dimensions?: Rect | Size | undefined
  volume: number
}

export interface EditorOptions extends Partial<EditorArgs> { }

export type ClipOrEffect = Clip | Effect

// export interface MashData extends Partial<DataMashGetResponse> { }

// export const isMashData = (value: any): value is MashData => (
//   isObject(value) && "mash" in value && isMashAndMediaObject(value.mash)
// )
// export function assertMashData(value: any, name?: string): asserts value is MashData {
//   if (!isMashData(value)) errorThrow(value, 'MashData', name)
// }

export interface Editor {
  actions: Actions
  addFiles(files: File[], editorIndex?: EditorIndex): Promise<Media[]>
  addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void>
  addMedia(object: MediaObject | MediaObjects, editorIndex?: EditorIndex): Promise<Media[]>
  addEffect: IndexHandler<Movable>
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  create(): Promise<void>
  currentTime: number
  // dataPutRequest(): Promise<DataPutRequest>
  dragging: boolean
  definitions: MediaArray
  definitionsUnsaved: MediaArray
  duration: number
  readonly mashMedia?: MashMedia
  editing: boolean
  editType: EditType
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  rect: Rect
  load(data: MashMediaObject): Promise<void>
  loop: boolean
  move(object: ClipOrEffect, editorIndex?: EditorIndex): void
  moveClip(clip: Clip, editorIndex?: EditorIndex): void
  moveEffect: IndexHandler<Movable>
  media: MediaCollection
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
  // removeLayer(layer: Layer): void
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringRecord): void
  readonly selection: EditorSelection
  svgElement: SVGSVGElement
  previewItems(enabled?: boolean): Promise<PreviewItems>
  time: Time
  timeRange: TimeRange
  undo(): void
  unload(): void
  updateDefinition(definitionObject: MediaObject, definition?: Media): Promise<void> 
  volume: number
}
