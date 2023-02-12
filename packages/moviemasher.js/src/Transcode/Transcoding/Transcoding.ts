import { isMediaType, TranscodeType } from "../../Setup/Enums";
import { isRequestable, Requestable, RequestableObject } from "../../Base/Requestable";


export interface TranscodingObject extends RequestableObject {
  type?: TranscodeType | string
  purpose?: string
}

export type TranscodingObjects = TranscodingObject[]


export interface Transcoding extends Requestable {
  type: TranscodeType
  purpose: string
}

export type Transcodings = Transcoding[]


export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && "type" in value && isMediaType(value.type)
}
