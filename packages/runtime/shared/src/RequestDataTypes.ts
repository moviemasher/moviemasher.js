import type { JsonRecord, JsonRecords, StringRecord, Strings } from './Core.js'
import type { Data, DataOrError } from './DataOrError.js'

export interface StringData extends Data<string> {}

export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>
export type StringDataOrError = DataOrError<string>
export type StringRecordDataOrError = DataOrError<StringRecord>
export type StringsDataOrError = DataOrError<Strings>
