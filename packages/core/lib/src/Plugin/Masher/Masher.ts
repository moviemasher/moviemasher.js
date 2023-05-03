import type { VideoStreamType, AudioStreamType, ClientAction } from '../../Setup/Enums.js'
import type { MasherType, Plugin} from '../Plugin.js'
import type { Action } from "./Actions/Action/Action.js"
import type { Clip, Clips } from '../../Media/Mash/Track/Clip/Clip.js'
import type {EditorSelection} from './EditorSelection/EditorSelection.js'
import type {Effect} from '../../Media/Effect/Effect.js'
import type {EncodingType} from '../Encode/Encoding/Encoding.js'
import type {IndexHandler} from '../../Helpers/Select/Select.js'
import type {MashMedia, Movable, MashMediaObject} from '../../Media/Mash/Mash.js'
import type {Media, MediaObject, MediaObjects, MediaArray} from '../../Media/Media.js'
import type {PreviewItems} from '../../Helpers/Svg/Svg.js'
import type {Rect} from '../../Utility/Rect.js'
import type {Size} from '../../Utility/Size.js'
import type {StringRecord} from '../../Types/Core.js'
import type {Time, TimeRange} from '../../Helpers/Time/Time.js'
import type {Track} from '../../Media/Mash/Track/Track.js'

import { TypesEncoding} from '../Encode/Encoding/Encoding.js'
import {Actions} from './Actions/Actions.js'
import {Emitter} from '../../Helpers/Emitter.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {MediaCollection} from '../../Media/Mash/MediaCollection/MediaCollection.js'
import {TypeAudioStream, TypeVideoStream } from '../../Setup/Enums.js'

export interface Masher {
  actions: Actions
  addEffect: IndexHandler<Movable>
  addMedia(media: Media | MediaArray, editorIndex?: MashIndex): Promise<Media[]> 
  addMediaObjects(object: MediaObject | MediaObjects, editorIndex?: MashIndex): Promise<Media[]>
  addTrack(): void
  autoplay: boolean
  buffer: number
  can(action: ClientAction): boolean
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
export const MashingTypes: MashingTypes = [...TypesEncoding, TypeVideoStream, TypeAudioStream]
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
