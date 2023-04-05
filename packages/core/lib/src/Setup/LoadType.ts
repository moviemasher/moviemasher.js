import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { EncodingType, TypesEncoding } from '../Plugin/Encode/Encoding/Encoding.js'
import { StringType, TypeString } from '../Utility/Scalar.js'
import type {
AudioType, FontType, ImageType, RecordsType, RecordType, VideoType 
} from './Enums.js'
import { 
  TypeFont, TypeRecord, TypeRecords, StorableType, TypesStorable,  
} from './Enums.js'


export type LoadType = AudioType | ImageType | VideoType | FontType | RecordType | RecordsType | StringType
export type LoadTypes = LoadType[]
export const TypesLoad: LoadTypes = [...TypesEncoding, TypeFont, TypeRecord, TypeRecords, TypeString]
export const isLoadType = (type?: any): type is LoadType => {
  return TypesLoad.includes(type)
}

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, 'LoadType', name)
}
export type UploadType = EncodingType | StorableType | FontType
export type UploadTypes = UploadType[]
export const TypesUpload: UploadTypes = [...TypesEncoding, ...TypesStorable, TypeFont]
export const isUploadType = (type?: any): type is UploadType => {
  return TypesUpload.includes(type)
}
