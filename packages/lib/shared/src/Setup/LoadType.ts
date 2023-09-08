import type { AssetType } from '@moviemasher/runtime-shared'
import type { LoadTypes, LoadType } from '@moviemasher/runtime-shared'
import type { FontType } from "@moviemasher/runtime-shared"

import { errorThrow } from '@moviemasher/runtime-shared'
import { STRING, ASSET_TYPES } from "@moviemasher/runtime-shared"
import { TypeFont, TypeRecord, TypeRecords } from "@moviemasher/runtime-shared"

export const TypesLoad: LoadTypes = [...ASSET_TYPES, TypeFont, TypeRecord, TypeRecords, STRING]
export const isLoadType = (type?: any): type is LoadType => {
  return TypesLoad.includes(type)
}

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, 'LoadType', name)
}
export type UploadType = AssetType | FontType
export type UploadTypes = UploadType[]
export const TypesUpload: UploadTypes = [...ASSET_TYPES, TypeFont]
export const isUploadType = (type?: any): type is UploadType => {
  return TypesUpload.includes(type)
}
