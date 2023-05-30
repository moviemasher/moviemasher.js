import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { EncodingType } from '../Plugin/Encode/Encoding/Encoding.js'
import { TypeString } from '../Utility/ScalarFunctions.js'
import { StringType } from "../Utility/ScalarTypes.js"
import type {
FontType, RecordsType, RecordType} from './Enums.js'
import { AudioType, ImageType, TypesAsset, VideoType } from '@moviemasher/runtime-shared'
import { TypeFont, TypeRecord, TypeRecords } from "./EnumConstantsAndFunctions.js"


export type LoadType = AudioType | ImageType | VideoType | FontType | RecordType | RecordsType | StringType
export type LoadTypes = LoadType[]
export const TypesLoad: LoadTypes = [...TypesAsset, TypeFont, TypeRecord, TypeRecords, TypeString]
export const isLoadType = (type?: any): type is LoadType => {
  return TypesLoad.includes(type)
}

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, 'LoadType', name)
}
export type UploadType = EncodingType | FontType
export type UploadTypes = UploadType[]
export const TypesUpload: UploadTypes = [...TypesAsset, TypeFont]
export const isUploadType = (type?: any): type is UploadType => {
  return TypesUpload.includes(type)
}
