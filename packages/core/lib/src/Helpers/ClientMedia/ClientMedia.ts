import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared'
import type { FontType } from '../../Setup/Enums.js'
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import { DataOrError, Data } from '@moviemasher/runtime-shared'
import { Asset, Assets } from '../../Shared/Asset/Asset.js'

export type ClientMediaType = AudioType | ImageType | VideoType | FontType

export type ClientMedia = AudioBuffer | FontFace | HTMLImageElement | HTMLVideoElement 

export type ClientMediaDataOrError = DataOrError<ClientImage> | DataOrError<ClientAudio> | DataOrError<ClientVideo> | DataOrError<ClientFont>


export type ClientAudio = AudioBuffer 
export type ClientAudioNode = AudioBufferSourceNode 
export type ClientFont = FontFace  
export type ClientImage = HTMLImageElement  
export type ClientVideo = HTMLVideoElement 
export type ClientAudioDataOrError = DataOrError<ClientAudio>
export type ClientFontDataOrError = DataOrError<ClientFont>
export type ClientImageDataOrError = DataOrError<ClientImage>
export type ClientImageOrVideo = ClientImage | ClientVideo
export type ClientVideoDataOrError = DataOrError<ClientVideo>
export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>
export type MediaDataArrayOrError = DataOrError<Assets>
export type MediaDataOrError = DataOrError<Asset>


export type StringData = Data<string>
export type StringDataOrError = DataOrError<string>

