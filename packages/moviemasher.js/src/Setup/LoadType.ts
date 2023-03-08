import { errorThrow } from "../Helpers/Error/ErrorFunctions";
import { EncodingType, EncodingTypes } from "../Plugin/Encode/Encoding/Encoding";
import { FontType, RecordType, RecordsType, JsonType, StorableType, StorableTypes } from "./Enums"



export type LoadType = string | EncodingType | FontType | RecordType | RecordsType;
export type LoadTypes = LoadType[];
export const LoadTypes: LoadTypes = [...EncodingTypes, FontType, JsonType];
export const isLoadType = (type?: any): type is LoadType => {
  return LoadTypes.includes(type);
};

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value))
    errorThrow(value, "LoadType", name);
}
export type UploadType = EncodingType | StorableType | FontType;
export type UploadTypes = UploadType[];
export const UploadTypes: UploadTypes = [...EncodingTypes, ...StorableTypes, FontType];
export const isUploadType = (type?: any): type is UploadType => {
  return UploadTypes.includes(type);
};
