import type { JsonRecord, JsonRecords, StringRecord } from './Core.js'
import type { Data, DataOrError } from './DataOrError.js'


export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>

export type StringData = Data<string>
export type StringDataOrError = DataOrError<string>

export type StringRecordDataOrError = DataOrError<StringRecord>

