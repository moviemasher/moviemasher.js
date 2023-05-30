import type { 
  Identified, Output, EndpointRequest, EndpointRequests 
} from '@moviemasher/lib-core'

import type { Input } from '../Types/Core.js'

export interface MediaEvent {
  body: string
}

export interface MediaRequest extends Identified {
  callback?: EndpointRequest | EndpointRequests
  input: Input
  output: Output
}

