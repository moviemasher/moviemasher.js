import /* type */ { DefiniteError } from "../Error/Error"
import /* type */ { EffectObject } from "../../Media/Effect/Effect"
import /* type */ { JsonRecord, JsonRecords } from "../../Types/Core"
import /* type */ { MashMediaObject } from "../../Media/Mash/Mash"
import /* type */ { Media, MediaArray } from "../../Media/Media"
import { EncodingType, EncodingTypes } from "../../Plugin/Encode/Encoding/Encoding"
import { FontType } from "../../Setup/Enums"

export type ClientMediaType = EncodingType | FontType

export type ClientMediaTypes = ClientMediaType[]
export const ClientMediaTypes: ClientMediaTypes = [...EncodingTypes, FontType]

export type ClientMedia = ClientImage | ClientVideo | ClientAudio | ClientFont

export type ClientMediaDataOrError = DataOrError<ClientImage> | DataOrError<ClientAudio> | DataOrError<ClientVideo> | DataOrError<ClientFont>

export type Data<T = unknown> = { data: T }
export type DataOrError<T> = DefiniteError | Data<T>

export type ClientAudio = AudioBuffer 
export type ClientAudioNode = AudioBufferSourceNode 
export type ClientEffect = EffectObject 
export type ClientFont = FontFace  
export type ClientImage = HTMLImageElement  
export type ClientMash = MashMediaObject 
export type ClientVideo = HTMLVideoElement 
export type ClientAudioDataOrError = DataOrError<ClientAudio>
export type ClientEffectDataOrError = DataOrError<ClientEffect>
export type ClientFontDataOrError = DataOrError<ClientFont>
export type ClientImageDataOrError = DataOrError<ClientImage>
export type ClientImageOrVideo = ClientImage | ClientVideo
export type ClientMashDataOrError = DataOrError<ClientMash>
export type ClientVideoDataOrError = DataOrError<ClientVideo>
export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>
export type MediaDataArrayOrError = DataOrError<MediaArray>
export type MediaDataOrError = DataOrError<Media>

export type PathData = Data<string>

export type PathDataOrError = DefiniteError | PathData

