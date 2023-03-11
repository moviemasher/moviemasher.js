import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { EncodingType, EncodingTypes } from "../Plugin/Encode/Encoding/Encoding"
import { StringType } from "../Utility/Scalar"
import { 
  FontType, RecordType, RecordsType, StorableType, StorableTypes, VideoType, ImageType, AudioType 
} from "./Enums"


export type LoadType = AudioType | ImageType | VideoType | FontType | RecordType | RecordsType | StringType
export type LoadTypes = LoadType[]
export const LoadTypes: LoadTypes = [...EncodingTypes, FontType, RecordType, RecordsType, StringType]
export const isLoadType = (type?: any): type is LoadType => {
  return LoadTypes.includes(type)
}

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, "LoadType", name)
}
export type UploadType = EncodingType | StorableType | FontType
export type UploadTypes = UploadType[]
export const UploadTypes: UploadTypes = [...EncodingTypes, ...StorableTypes, FontType]
export const isUploadType = (type?: any): type is UploadType => {
  return UploadTypes.includes(type)
}
