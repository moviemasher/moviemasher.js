
import { JsonObject, Endpoint, AndId, WithError, StringObject } from "../declarations"
import { ServerType } from "../Setup/Enums"
import { DataServerInit } from "./Data"

export const ApiVersion = '5.0.3'

export interface ApiRequest {
  [index: string]: any
  version?: string
}
export interface ApiResponse extends WithError { }

export interface ApiRequestInit { // extends RequestInit
  body?: any
  headers?: StringObject
  method?: string
}


export interface EndpointPromiser {
 (id: string, body?: JsonObject): Promise<any>
}

export interface ApiCallback {
  endpoint: Endpoint
  request?: ApiRequestInit
  expires?: string
}
export interface ApiCallbacks extends Record<string, ApiCallback> {}

export interface ApiServerInit extends JsonObject { }


export interface ApiEndpointRequest extends ApiRequest, AndId {}


export interface ApiEndpointResponse extends ApiResponse {
  apiCallbacks: ApiCallbacks
}

export interface ApiCallbackResponse extends ApiResponse {
  apiCallback?: ApiCallback
}
export interface ApiServersRequest extends ApiRequest {}


export interface ApiServersResponse extends ApiResponse {
  [ServerType.Api]?: ApiServerInit
  [ServerType.Data]?: DataServerInit
  [ServerType.File]?: JsonObject
  [ServerType.Rendering]?: JsonObject
  [ServerType.Streaming]?: JsonObject
  [ServerType.Web]?: JsonObject
}
