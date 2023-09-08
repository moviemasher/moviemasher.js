import type { JsonRecord, JsonRecords, StringRecord, Strings } from './Core.js'
import type { Data, DataOrError } from './DataOrError.js'


export type JsonRecordDataOrError = DataOrError<JsonRecord>
export type JsonRecordsDataOrError = DataOrError<JsonRecords>

export type StringData = Data<string>
export type StringDataOrError = DataOrError<string>
export type StringsDataOrError = DataOrError<Strings>

export type StringRecordDataOrError = DataOrError<StringRecord>

