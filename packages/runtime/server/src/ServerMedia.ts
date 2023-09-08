import type { JsonRecord, EndpointRequest, JsonRecords } from "@moviemasher/runtime-shared"

export interface ServerMediaRequest extends EndpointRequest {
  blob?: Blob
  record?: JsonRecord
  records?: JsonRecords
  path?: string
  objectUrl?: string
  file?: File
}
