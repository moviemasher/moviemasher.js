
import { JsonRecord, StringRecord } from "../declarations"
import { Identified } from "../Base/Identified"
import { Endpoint, isEndpoint } from "../Helpers/Endpoint/Endpoint"
import { PotentialError } from "../Helpers/Error/Error"
import { ServerType } from "../Setup/Enums"
import { isObject } from "../Utility/Is"
import { DataServerInit } from "./Data"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"

export const ApiVersion = "5.1.2"

export interface ApiRequest {
  [index: string]: any
  version?: string
}
export interface ApiResponse extends PotentialError { }

export interface RequestInitObject { 
  body?: any
  headers?: StringRecord
  method?: string
}


export interface EndpointPromiser {
 (id: string, body?: JsonRecord): Promise<any>
}

export interface RequestObject {
  endpoint: Endpoint
  init?: RequestInitObject
}
export type RequestObjects = RequestObject[]

export const isRequestObject = (value: any): value is RequestObject => {
  return isObject(value) && "endpoint" in value && isEndpoint(value.endpoint)
}
export function assertRequestObject(value: any, name?: string): asserts value is RequestObject {
  if (!isRequestObject(value)) errorThrow(value, 'RequestObject', name)
}

export interface RequestRecord extends Record<string, RequestObject> {}

export interface ApiCallback extends RequestObject {
  expires?: string
}

export interface ApiCallbacks extends Record<string, ApiCallback> {}

export interface ApiServerInit extends JsonRecord { }


export interface ApiCallbacksRequest extends ApiRequest, Identified {}


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
  [ServerType.File]?: JsonRecord
  [ServerType.Rendering]?: JsonRecord
  [ServerType.Web]?: JsonRecord
}
