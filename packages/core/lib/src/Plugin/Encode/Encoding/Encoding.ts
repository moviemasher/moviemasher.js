
import type { AudioType, ImageType, VideoType } from '../../../Setup/Enums.js'
import type { Requestable, RequestableObject } from '../../../Base/Requestable/Requestable.js'

import { errorThrow } from '../../../Helpers/Error/ErrorFunctions.js'
import { TypeAudio, TypeImage, TypeVideo } from '../../../Setup/Enums.js'

export interface Encoding extends Requestable {}
export type Encodings = Encoding[]

export interface EncodingObject extends RequestableObject {}
export type EncodingObjects = EncodingObject[]

export type EncodingType = AudioType | ImageType | VideoType
export type EncodingTypes = EncodingType[]
export const TypesEncoding: EncodingTypes = [TypeAudio, TypeImage, TypeVideo]
export const isEncodingType = (type?: any): type is EncodingType => {
  return TypesEncoding.includes(type)
}
export function assertEncodingType(type: any, name?: string): asserts type is EncodingType {
  if (!isEncodingType(type)) errorThrow(type, 'EncodingType', name)
}

