import type { AssetType } from '@moviemasher/runtime-shared'
import type { LoadTypes, LoadType } from '@moviemasher/runtime-shared'
import type { FontType } from "@moviemasher/runtime-shared"

import { errorThrow } from '@moviemasher/runtime-shared'
import { STRING, ASSET_TYPES } from "@moviemasher/runtime-shared"
import { FONT, RECORD, RECORDS } from "@moviemasher/runtime-shared"

export const TypesLoad: LoadTypes = [...ASSET_TYPES, FONT, RECORD, RECORDS, STRING]
export const isLoadType = (type?: any): type is LoadType => {
  return TypesLoad.includes(type)
}

export function assertLoadType(value: any, name?: string): asserts value is LoadType {
  if (!isLoadType(value)) errorThrow(value, 'LoadType', name)
}
export type UploadType = AssetType | FontType
export type UploadTypes = UploadType[]
export const TypesUpload: UploadTypes = [...ASSET_TYPES, FONT]
export const isUploadType = (type?: any): type is UploadType => {
  return TypesUpload.includes(type)
}
