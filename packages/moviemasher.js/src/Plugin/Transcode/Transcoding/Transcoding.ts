import { FontType, SequenceType } from "../../../Setup/Enums"
import { isMediaType } from "../../../Setup/MediaType"
import { isRequestable, Requestable, RequestableObject } from "../../../Base/Requestable"
import { EncodingType, EncodingTypes } from "../../Encode/Encoding/Encoding"


export interface TranscodingObject extends RequestableObject {
  type?: TranscodingType | string
  purpose?: string
}

export type TranscodingObjects = TranscodingObject[]


export interface Transcoding extends Requestable {
  type: TranscodingType
  purpose: string
}

export type Transcodings = Transcoding[]


export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && "type" in value && isMediaType(value.type)
}

export type TranscodingType = EncodingType | FontType | SequenceType 
export type TranscodingTypes = TranscodingType[]
export const TranscodingTypes: TranscodingTypes = [...EncodingTypes, FontType, SequenceType]

