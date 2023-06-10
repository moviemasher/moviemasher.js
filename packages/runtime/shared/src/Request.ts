import type { StringRecord } from './Core.js'
import type { Endpoint } from './Endpoint.js'

export interface EndpointRequest {
  response?: any | undefined
  endpoint?: Endpoint | string
  init?: RequestInit
}
export type EndpointRequests = EndpointRequest[]

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}
