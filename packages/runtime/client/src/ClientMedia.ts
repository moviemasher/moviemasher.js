import type {
  AudioType, DataOrError, FontType, ImageType, VideoType
} from '@moviemasher/runtime-shared'

export type ClientAudio = AudioBuffer 
export type ClientAudioDataOrError = DataOrError<ClientAudio>
export type ClientAudioNode = AudioBufferSourceNode 

export type ClientFont = FontFace  
export type ClientFontDataOrError = DataOrError<ClientFont>

export type ClientImage = HTMLImageElement  
export type ClientImageDataOrError = DataOrError<ClientImage>
export type ClientImageOrVideo = ClientImage | ClientVideo

export type ClientMedia = AudioBuffer | FontFace | HTMLImageElement | HTMLVideoElement 
export type ClientMediaDataOrError = DataOrError<ClientImage> | DataOrError<ClientAudio> | DataOrError<ClientVideo> | DataOrError<ClientFont>
export type ClientMediaType = AudioType | ImageType | VideoType | FontType

export type ClientVideo = HTMLVideoElement 
export type ClientVideoDataOrError = DataOrError<ClientVideo>
