import { AssetType } from './AssetType.js'
import { StringType } from './ScalarTypes.js'

export type FontType = 'font'
export type RecordsType = 'records'
export type RecordType = 'record'

export type LoadType = AssetType | FontType | RecordType | RecordsType | StringType
export type LoadTypes = LoadType[]
