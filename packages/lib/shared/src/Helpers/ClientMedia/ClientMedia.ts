import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared'
import type { FontType } from '../../Setup/Enums.js'
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { DataOrError, Data } from '@moviemasher/runtime-shared'
import type { Asset, Assets } from '../../Shared/Asset/AssetTypes.js'


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

export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>


export type StringData = Data<string>
export type StringDataOrError = DataOrError<string>



export type MediaDataArrayOrError = DataOrError<Assets>
export type MediaDataOrError = DataOrError<Asset>