import type { EndpointRequest } from "@moviemasher/runtime-shared"

export interface ServerMediaRequest extends EndpointRequest {
  path?: string
  httpPath?: string
  httpType?: string
}
