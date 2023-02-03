
import { JsonObject, Endpoint, AndId, WithError, StringObject, isEndpoint } from "../declarations"
import { ServerType } from "../Setup/Enums"
import { isObject } from "../Utility/Is"
import { DataServerInit } from "./Data"

export const ApiVersion = "5.1.2"

export interface ApiRequest {
  [index: string]: any
  version?: string
}
export interface ApiResponse extends WithError { }

export interface RequestInitObject { 
  body?: any
  headers?: StringObject
  method?: string
}


export interface EndpointPromiser {
 (id: string, body?: JsonObject): Promise<any>
}

export interface RequestObject {
  endpoint: Endpoint
  init?: RequestInitObject
}
export type RequestObjects = RequestObject[]

export const isRequestObject = (value: any): value is RequestObject => {
  return isObject(value) && "endpoint" in value && isEndpoint(value.endpoint)
}

export interface RequestRecord extends Record<string, RequestObject> {}

export interface ApiCallback extends RequestObject {
  expires?: string
}

export interface ApiCallbacks extends Record<string, ApiCallback> {}

export interface ApiServerInit extends JsonObject { }


export interface ApiCallbacksRequest extends ApiRequest, AndId {}


export interface ApiCallbacksResponse extends ApiResponse {
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
