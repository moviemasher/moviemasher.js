import type { Output } from '@moviemasher/lib-shared'
import type { EndpointRequest, EndpointRequests, Identified } from '@moviemasher/runtime-shared'
import type { Input } from '../Types/Input.js'

export interface MediaEvent {
  body: string
}

export interface IdentifiedRequest extends Identified {
  callback?: EndpointRequest | EndpointRequests
  input: Input
  output: Output
}
