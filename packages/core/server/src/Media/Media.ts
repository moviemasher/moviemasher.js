import { 
  isIdentified, errorThrow, Identified, isObject, Output, EndpointRequest, EndpointRequests 
} from "@moviemasher/lib-core"
import { Input } from "../Types/Core"

export interface MediaEvent {
  body: string
}

export interface MediaRequest extends Identified {
  callback?: EndpointRequest | EndpointRequests
  input: Input
  output: Output
}
export const isMediaRequest = (value: any): value is MediaRequest => {
  return isIdentified(value) && 
    "input" in value && 
    isObject(value.input)
}
export function assertMediaRequest(value: any): asserts value is MediaRequest {
  if (!isMediaRequest(value)) errorThrow(value, 'MediaRequest')
}

