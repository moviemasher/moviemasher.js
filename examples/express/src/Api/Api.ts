import type { EndpointRequest, Identified, JsonRecord, PotentialError } from '@moviemasher/runtime-shared'


 export interface ApiRequest {
  [index: string]: any
  version?: string
}
 
export interface ApiResponse extends PotentialError {}


 export interface EndpointPromiser {
 (id: string, body?: JsonRecord): Promise<any>
}


 export interface ApiCallback extends EndpointRequest {
  expires?: string
}

 export interface ApiCallbacks extends Record<string, ApiCallback> {}

 export interface ApiServerInit { }


 export interface ApiCallbacksRequest extends ApiRequest, Identified {}


 export interface ApiCallbacksResponse extends ApiResponse {
  apiCallbacks: ApiCallbacks
}

 export interface ApiCallbackResponse extends ApiResponse {
  apiCallback?: ApiCallback
}
