import { StringRecord } from "../../declarations"
import { Endpoint, isEndpoint } from "../Endpoint/Endpoint"
import { isObject } from "../../Utility/Is"
import { errorThrow } from "../Error/ErrorFunctions"



export interface Request {
  response?: unknown
  endpoint: Endpoint
  init?: RequestInit
}
export type Requests = Request[]

export const isRequest = (value: any): value is Request => {
  return isObject(value) && "endpoint" in value && isEndpoint(value.endpoint)
}
export function assertRequest(value: any, name?: string): asserts value is Request {
  if (!isRequest(value))
    errorThrow(value, 'Request', name)
}

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}

export interface RequestRecord extends Record<string, Request> { }
