import { errorThrow, Identified, isObject, isPopulatedString, Output, PathOrError, RequestObject, RequestObjects } from "@moviemasher/moviemasher.js";
import { Input } from "../declarations";

export interface MediaEvent {
  body: string
}

export interface MediaResponse extends PathOrError {}



export interface MediaRequest extends Identified {
  callback?: RequestObject | RequestObjects
  input: Input
  output: Output
}
export const isMediaRequest = (value: any): value is MediaRequest => {
  return isObject(value) && isPopulatedString(value.id) && isObject(value.input)
}
export function assertMediaRequest(value: any): asserts value is MediaRequest {
  if (!isMediaRequest(value)) errorThrow(value, 'MediaRequest')
}

