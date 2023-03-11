import { StringRecord } from "../../Types/Core"
import { IndexHandler } from "../../Helpers/Select/Select"
import { PreviewItems } from "../../Helpers/Svg/Svg"
import { Emitter } from "../../Helpers/Emitter"
import { AudioStreamType, MasherAction, VideoStreamType } from "../../Setup/Enums"
import { MashMedia, Movable, MashMediaObject } from "../../Media/Mash/Mash"
import { Effect } from "../../Media/Effect/Effect"
import { Track } from "../../Media/Mash/Track/Track"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Action } from "./Actions/Action/Action"
import { Clip, Clips } from "../../Media/Mash/Track/Clip/Clip"
import { Actions } from "./Actions/Actions"
import { EditorSelection } from "./EditorSelection"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { Rect } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { Media, MediaObject, MediaObjects, MediaArray } from "../../Media/Media"
import { MediaCollection } from "../../Media/Mash/MediaCollection/MediaCollection"
import { MasherType, Plugin } from "../Plugin"
import { EncodingType, EncodingTypes } from "../Encode/Encoding/Encoding"


export interface Masher {
  actions: Actions
  addEffect: IndexHandler<Movable>
  addMedia(media: Media | MediaArray, editorIndex?: MashIndex): Promise<Media[]> 
  addMediaObjects(object: MediaObject | MediaObjects, editorIndex?: MashIndex): Promise<Media[]>
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: MasherAction): boolean
  clips: Clips
  create(): Promise<void>
  currentTime: number
  definitions: MediaArray
  definitionsUnsaved: MediaArray
  dragging: boolean
  duration: number
  editing: boolean
  eventTarget: Emitter
  fps: number
  goToTime(value: Time): Promise<void>
  handleAction(action: Action): void
  load(data: MashMediaObject): Promise<void>
  loop: boolean
  mashingType: MashingType
  media: MediaCollection
  move(object: ClipOrEffect, editorIndex?: MashIndex): void
  moveClip(clip: Clip, editorIndex?: MashIndex): void
  moveEffect: IndexHandler<Movable>
  muted: boolean
  pause(): void
  paused: boolean
  play(): void
  position: number
  positionStep: number
  precision: number
  previewItems(enabled?: boolean): Promise<PreviewItems>
  readonly mashMedia?: MashMedia
  readonly selection: EditorSelection
  readOnly: boolean
  rect: Rect
  redo(): void
  redraw(): void
  removeClip(clip: Clip): void
  removeEffect: IndexHandler<Movable>
  removeTrack(track: Track): void
  saved(temporaryIdLookup?: StringRecord): void
  time: Time
  timeRange: TimeRange
  undo(): void
  unload(): void
  volume: number
}

export interface MasherPlugin extends Plugin {
  type: MasherType
  masher(options?: MasherOptions): Masher
}


/**
 * @category Plugin
 */
export interface PluginsByMashing extends Record<MashingType, MasherPlugin> {}

export type MashingType = string | EncodingType | VideoStreamType | AudioStreamType
export type MashingTypes = MashingType[]
export const MashingTypes: MashingTypes = [...EncodingTypes, VideoStreamType, AudioStreamType]
export const isMashingType = (type?: any): type is MashingType => {
  return MashingTypes.includes(type)
}
export function assertMashingType(value: any, name?: string): asserts value is MashingType {
  if (!isMashingType(value)) errorThrow(value, 'MashingType', name)
}



export interface MashIndex {
  clip?: number
  track?: number
  effect?: number
}


export interface MasherArgs {
  autoplay: boolean
  buffer: number
  dimensions?: Rect | Size | undefined
  eventTarget?: Emitter
  fps: number
  loop: boolean
  mash?: MashMediaObject
  mashingType?: MashingType
  patchSvg?: SVGSVGElement
  precision: number
  readOnly?: boolean
  volume: number
}

export interface MasherOptions extends Partial<MasherArgs> { }

export type ClipOrEffect = Clip | Effect
