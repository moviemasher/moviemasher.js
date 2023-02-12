import { MashMediaObject } from "../Media/Mash/Mash";
import { EffectObject } from "../Media/Effect/Effect";
import { isLoadedAudio, isLoadedImage, isLoadedVideo } from "./Loader";
import { PotentialError } from "../Helpers/Error/Error";
import { JsonRecord } from "../declarations";


export type RawMedia =  LoadedImageOrVideo | LoadedAudio
export const isRawMedia = (value: any): value is RawMedia => {
  return isLoadedImage(value) || isLoadedVideo(value) || isLoadedAudio(value)
}
export type LoadedMedia = LoadedImageOrVideo | LoadedAudio | LoadedFont

export interface LoadedImage extends HTMLImageElement { } // limited Image API in tests!

export interface LoadedVideo extends HTMLVideoElement { }
export interface LoadedAudio extends AudioBuffer { }
export interface LoadedFont extends FontFace { } // just { family: string } in tests!

export interface LoadedEffect extends EffectObject { }
export interface LoadedMash extends MashMediaObject { }
export type LoadedImageOrVideo = LoadedImage | LoadedVideo


export interface AudibleSource extends AudioBufferSourceNode { }


export interface ClientImageOrError extends PotentialError {
  clientImage?: LoadedImage
}

export interface ClientAudioOrError extends PotentialError {
  clientAudio?: LoadedAudio
}

export interface ClientFontOrError extends PotentialError {
  clientFont?: LoadedFont
}


export interface ClientVideoOrError extends PotentialError {
  clientVideo?: LoadedVideo
}


export interface ClientMediaOrError extends PotentialError {
  clientMedia?: LoadedMedia
}

export type JsonRecordOrError = JsonRecord | Error