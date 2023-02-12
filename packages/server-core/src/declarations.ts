import { RequestObject, StringRecord, Value } from "@moviemasher/moviemasher.js"

export interface RequestArgs {
  auth?: string;
  headers?: StringRecord
  hostname?: string
  method?: string
  path?: string;
  port?: Value
  protocol?: string
}

export interface Input {
  request?: RequestObject
}
