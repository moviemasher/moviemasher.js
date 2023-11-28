import type { AudioType, DataOrError, EndpointRequest, FontType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { SvgOrImage } from './Svg.js'

export type ClientAudioDataOrError = DataOrError<AudioBuffer>

export interface ClientFont extends FontFace{}
export type ClientFontDataOrError = DataOrError<ClientFont>

export interface ClientImage extends HTMLImageElement{}
export type ClientImageDataOrError = DataOrError<ClientImage>

export type ClientImageOrVideo = ClientImage | ClientVideo
export type ClientMedia = AudioBuffer | FontFace | HTMLImageElement | HTMLVideoElement 

export type ClientMediaType = AudioType | ImageType | VideoType | FontType

export interface ClientVideo extends HTMLVideoElement{}
export type ClientVideoDataOrError = DataOrError<ClientVideo>

export interface ClientMediaRequest extends EndpointRequest {
  response?: ClientMedia
  objectUrl?: string
  file?: File
}

export type SvgOrImageDataOrError = DataOrError<SvgOrImage>
