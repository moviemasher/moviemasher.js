import type { EndpointRequest, LoadType } from '@moviemasher/runtime-shared'

export interface Input {
  loadType: LoadType
  request?: EndpointRequest
}
