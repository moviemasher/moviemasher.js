import { UnknownRecord } from "../../declarations"
import { PreviewItems } from "../../Helpers/Svg/Svg"
import { AVType, MashType } from "../../Setup/Enums"
import { Time, Times } from "../../Helpers/Time/Time"
import { Clip, Clips } from "./Track/Clip/Clip"
import { AudioPreview } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { TimeRange } from "../../Helpers/Time/Time"
import { Track, TrackObject } from "./Track/Track"
import { isArray, isObject } from "../../Utility/Is"

import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { Propertied } from "../../Base/Propertied"
import { Effect } from "../Effect/Effect"
import { Media, MediaObject, MediaObjects } from "../Media"
import { EncodingObjects, Encodings } from "../../Encode/Encoding/Encoding"
import { Selectable } from "../../Editor/Selectable"
import { Size } from "../../Utility/Size"
import { PreloadOptions } from "../../Base/Code"
import { Editor } from "../../Editor/Editor"
import { Emitter } from "../../Helpers/Emitter"
import { MediaCollection } from "../../Base/MediaCollection"

export enum Frame {
  First = 0,
  Last = -1,
}

export type Movable = Effect 
export type Movables = Movable[]

export interface MashMediaObject extends MediaObject {
  color?: string
  encodings?: EncodingObjects
  quantize?: Number
  tracks?: TrackObject[]
  media?: MediaObjects
}

export interface MashMediaArgs extends MashMediaObject {
  mediaCollection?: MediaCollection
  editor?: Editor
  buffer?: number
  gain?: number
  loop?: boolean
  emitter?: Emitter
  size?: Size
}
export interface MashAndMediaObject extends MashMediaObject {
  media: MediaObjects
}
export const isMashAndMediaObject = (value: any): value is MashAndMediaObject => {
  return isObject(value) && "media" in value && isArray(value.media)
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
  editor: Editor
  emitter?: Emitter
  encodings: Encodings
  endTime: Time
  frame: number
  frames: number
  gain: number
  imageSize: Size
  loading: boolean
  loadPromise(args?: PreloadOptions): Promise<void>
  loop: boolean
  media: MediaCollection
  paused: boolean
  previewItemsPromise(editor?: Editor): Promise<PreviewItems>
  putPromise(): Promise<void>
  quantize: number
  reload(): Promise<void> | undefined
  removeClipFromTrack(clip : Clip | Clips) : void
  removeTrack(index?: number): void
  seekToTime(time: Time): Promise<void> | undefined
  time: Time
  timeRange: TimeRange
  timeRanges(avType: AVType, startTime?: Time): Times
  toJSON(): UnknownRecord
  tracks: Track[]
  type: MashType
}
export const isMashMedia = (value: any): value is MashMedia => {
  return isObject(value) && "composition" in value
}
export function assertMashMedia(value: any, name?: string): asserts value is MashMedia {
  if (!isMashMedia(value)) errorThrow(value, "MashMedia", name)
}
