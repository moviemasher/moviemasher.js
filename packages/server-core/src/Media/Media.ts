import { 
  isIdentified, errorThrow, Identified, isObject, Output, Request, Requests 
} from "@moviemasher/moviemasher.js";
import { Input } from "../declarations";

export interface MediaEvent {
  body: string
}

export interface MediaRequest extends Identified {
  callback?: Request | Requests
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

