import { StringObject, Value } from "@moviemasher/moviemasher.js"

export interface RequestArgs {
  auth?: string;
  headers?: StringObject
  hostname?: string
  method?: string
  path?: string;
  port?: Value
  protocol?: string
}
