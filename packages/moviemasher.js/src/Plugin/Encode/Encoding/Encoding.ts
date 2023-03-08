
import /* type */ { Requestable, RequestableObject } from "../../../Base/Requestable"
import { errorThrow } from "../../../Helpers/Error/ErrorFunctions"
import { AudioType, ImageType, VideoType } from "../../../Setup/Enums"

export interface Encoding extends Requestable {
  
}

export type Encodings = Encoding[]


export interface EncodingObject extends RequestableObject {

}

export type EncodingObjects = EncodingObject[]



export type EncodingType = AudioType | ImageType | VideoType
export type EncodingTypes = EncodingType[]
export const EncodingTypes: EncodingTypes = [AudioType, ImageType, VideoType]
export const isEncodingType = (type?: any): type is EncodingType => {
  return EncodingTypes.includes(type)
}
export function assertEncodingType(type: any, name?: string): asserts type is EncodingType {
  if (!isEncodingType(type)) errorThrow(type, 'EncodingType', name)
}

