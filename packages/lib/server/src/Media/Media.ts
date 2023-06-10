import type { Output, 
} from '@moviemasher/lib-shared'

import type { Input } from '../Types/Core.js'
import type { EndpointRequest, EndpointRequests, Identified } from '@moviemasher/runtime-shared'

export interface MediaEvent {
  body: string
}

export interface MediaRequest extends Identified {
  callback?: EndpointRequest | EndpointRequests
  input: Input
  output: Output
}

