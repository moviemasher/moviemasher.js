import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared';
import type { DataOrError, Data } from '@moviemasher/runtime-shared';


export type JsonRecordDataOrError = DataOrError<JsonRecord>;
export type JsonRecordsDataOrError = DataOrError<JsonRecords>;

export type StringData = Data<string>;
export type StringDataOrError = DataOrError<string>;
