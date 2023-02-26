import { MashMediaObject } from "../Media/Mash/Mash";
import { EffectObject } from "../Media/Effect/Effect";
import { isClientAudio, isClientImage, isClientVideo } from "./ClientMediaFunctions";
import { DefiniteError, PotentialError } from "../Helpers/Error/Error";
import { JsonRecord, JsonRecords } from "../declarations";


export type RawMedia =  ClientImageOrVideo | ClientAudio
export const isRawMedia = (value: any): value is RawMedia => {
  return isClientImage(value) || isClientVideo(value) || isClientAudio(value)
}
export type ClientMedia = ClientImage | ClientVideo | ClientAudio | ClientFont

export interface ClientImage extends HTMLImageElement {} 

export interface ClientVideo extends HTMLVideoElement {}
export interface ClientAudio extends AudioBuffer {}
export interface ClientFont extends FontFace {} 

export interface ClientEffect extends EffectObject {}
export interface ClientMash extends MashMediaObject {}
export type ClientImageOrVideo = ClientImage | ClientVideo


export interface ClientAudioNode extends AudioBufferSourceNode {}

export interface Data {
  data: unknown
}

export interface VideoData extends Data {
  data: ClientVideo
}

export interface AudioData extends Data {
  data: ClientAudio
}

export interface ImageData extends Data {
  data: ClientImage
}

export interface FontData extends Data {
  data: ClientFont
}

export interface EffectData extends Data {
  data: ClientEffect
}

export interface MashData extends Data {
  data: ClientMash
}

export interface RecordData extends Data {
  data: JsonRecord
}

export interface RecordsData extends Data {
  data: JsonRecords
}

export type MediaData = ImageData | VideoData | AudioData | FontData

export type ImageDataOrError = DefiniteError | ImageData

export type AudioDataOrError = DefiniteError | AudioData

export type VideoDataOrError = DefiniteError | VideoData

export type FontDataOrError = DefiniteError | FontData

export type MediaDataOrError = ImageDataOrError | AudioDataOrError | VideoDataOrError | FontDataOrError

export type EffectDataOrError = DefiniteError | EffectData
export type MashDataOrError = DefiniteError | MashData
export type RecordDataOrError = DefiniteError | RecordData
export type RecordsDataOrError = DefiniteError | RecordsData
