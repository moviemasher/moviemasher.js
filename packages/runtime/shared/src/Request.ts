import type { StringRecord } from './Core.js'
import type { Endpoint } from './Endpoint.js'

export interface EndpointRequest {
  endpoint: Endpoint | string
  init?: RequestInit
}

export interface EndpointRequests extends Array<EndpointRequest>{}

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}
