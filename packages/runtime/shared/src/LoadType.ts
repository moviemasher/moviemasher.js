import type { ImportType } from './ImportType.js'
import type { StringType } from './ScalarTypes.js'

export type RecordsType = 'records'
export type RecordType = 'record'

export type LoadType = ImportType | RecordType | RecordsType | StringType
export interface LoadTypes extends Array<LoadType>{}
