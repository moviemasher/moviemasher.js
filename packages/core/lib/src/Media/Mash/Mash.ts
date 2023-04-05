import { UnknownRecord } from '../../Types/Core.js'
import { PreviewItems } from '../../Helpers/Svg/Svg.js'
import { AVType, MashType } from '../../Setup/Enums.js'
import { Time, Times } from '../../Helpers/Time/Time.js'
import { Clip, Clips } from './Track/Clip/Clip.js'
import { TimeRange } from '../../Helpers/Time/Time.js'
import { Track, TrackObject } from './Track/Track.js'
import { isArray, isObject } from '../../Utility/Is.js'

import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { Request } from '../../Helpers/Request/Request.js'
import { Propertied } from '../../Base/Propertied.js'
import { Effect } from '../Effect/Effect.js'
import { Media, MediaObject, MediaObjects } from '../Media.js'
import { EncodingObjects, Encodings } from '../../Plugin/Encode/Encoding/Encoding.js'
import { Size } from '../../Utility/Size.js'
import { PreloadOptions } from '../../Base/Code.js'
import { Emitter } from '../../Helpers/Emitter.js'
import { MediaCollection } from './MediaCollection/MediaCollection.js'
import { Masher, MashingType } from '../../Plugin/Masher/Masher.js'
import { Selectable } from '../../Plugin/Masher/Selectable.js'
import { AudioPreview } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'

export type Movable = Effect 
export type Movables = Movable[]

export interface MashMediaContent {
  color?: string
  quantize?: number
  tracks?: TrackObject[]
  media?: MediaObjects
}

export interface MashMediaRequest extends Request {
  response?: MashMediaContent | undefined
}

export interface MashMediaObject extends MediaObject {
  request?: MashMediaRequest
  encodings?: EncodingObjects
}

export interface MashMasherArgs {
  mediaCollection: MediaCollection
  masher: Masher
  buffer: number
  gain: number
  loop: boolean
  emitter: Emitter
  size: Size
}
export interface MashMediaArgs extends MashMediaObject {
  
}
export interface MashAndMediaObject extends MashMediaObject {
  media: MediaObjects
}
export const isMashAndMediaObject = (value: any): value is MashAndMediaObject => {
  return isObject(value) && 'media' in value && isArray(value.media)
}

/**
 * @category Media
 */
export interface MashMedia extends Media, Selectable {
  addClipToTrack(clip : Clip | Clips, trackIndex? : number, insertIndex? : number, frame? : number) : void
  addTrack(object?: TrackObject): Track
  buffer: number
  changeTiming(propertied: Propertied, property: string, value : number) : void
  clearPreview(): void
  clips: Clip[]
  clipsInTimeOfType(time: Time, avType?: AVType): Clip[]
  color: string
  composition: AudioPreview
  definitionIds: string[]
  destroy(): void
  draw() : void
  drawnTime? : Time
  duration: number
  editor: Masher
  emitter?: Emitter
  encodings: Encodings
  endTime: Time
  frame: number
  frames: number
  gain: number
  imageSize: Size
  kind: MashingType
  loading: boolean
  loadPromise(args?: PreloadOptions): Promise<void>
  loop: boolean
  media: MediaCollection
  paused: boolean
  previewItemsPromise(editor?: Masher): Promise<PreviewItems>
  putPromise(): Promise<void>
  quantize: number
  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : Clip | Clips) : void
  removeTrack(index?: number): void
  request: MashMediaRequest

  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  timeRanges(avType: AVType, startTime?: Time): Times
  toJSON(): UnknownRecord
  tracks: Track[]
  type: MashType
}
export const isMashMedia = (value: any): value is MashMedia => {
  return isObject(value) && 'composition' in value
}
export function assertMashMedia(value: any, name?: string): asserts value is MashMedia {
  if (!isMashMedia(value)) errorThrow(value, 'MashMedia', name)
}
