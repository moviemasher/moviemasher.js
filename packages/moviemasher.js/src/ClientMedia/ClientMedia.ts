import { MashMediaObject } from "../Media/Mash/Mash";
import { EffectObject } from "../Media/Effect/Effect";
import { isClientAudio, isClientImage, isClientVideo } from "./ClientMediaFunctions";
import { PotentialError } from "../Helpers/Error/Error";
import { JsonRecord } from "../declarations";


export type RawMedia =  ClientImageOrVideo | ClientAudio
export const isRawMedia = (value: any): value is RawMedia => {
  return isClientImage(value) || isClientVideo(value) || isClientAudio(value)
}
export type ClientMedia = ClientImageOrVideo | ClientAudio | ClientFont

export interface ClientImage extends HTMLImageElement { } // limited Image API in tests!

export interface ClientVideo extends HTMLVideoElement { }
export interface ClientAudio extends AudioBuffer { }
export interface ClientFont extends FontFace { } // just { family: string } in tests!

export interface ClientEffect extends EffectObject { }
export interface ClientMash extends MashMediaObject { }
export type ClientImageOrVideo = ClientImage | ClientVideo


export interface ClientAudioNode extends AudioBufferSourceNode { }


export interface ClientImageOrError extends ClientMediaOrError {
  clientImage?: ClientImage
}

export interface ClientAudioOrError extends ClientMediaOrError {
  clientAudio?: ClientAudio
}

export interface ClientFontOrError extends ClientMediaOrError {
  clientFont?: ClientFont
}


export interface ClientVideoOrError extends ClientMediaOrError {
  clientVideo?: ClientVideo
}


export interface ClientMediaOrError extends PotentialError {
  clientMedia?: ClientMedia
}

export type JsonRecordOrError = JsonRecord | Error