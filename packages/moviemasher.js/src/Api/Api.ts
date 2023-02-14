
import { JsonRecord } from "../declarations"
import { Identified } from "../Base/Identified"
import { PotentialError } from "../Helpers/Error/Error"
import { ServerType } from "../Setup/Enums"
import { DataServerInit } from "./Data"
import { Request } from "../Helpers/Request/Request"

export const ApiVersion = "5.1.2"

/**
 * @category API
 */
 export interface ApiRequest {
  [index: string]: any
  version?: string
}
/**
 * @category API
 */
 export interface ApiResponse extends PotentialError { }


/**
 * @category API
 */
 export interface EndpointPromiser {
 (id: string, body?: JsonRecord): Promise<any>
}


/**
 * @category API
 */
 export interface ApiCallback extends Request {
  expires?: string
}

/**
 * @category API
 */
 export interface ApiCallbacks extends Record<string, ApiCallback> {}

/**
 * @category API
 */
 export interface ApiServerInit extends JsonRecord { }


/**
 * @category API
 */
 export interface ApiCallbacksRequest extends ApiRequest, Identified {}


/**
 * @category API
 */
 export interface ApiCallbacksResponse extends ApiResponse {
  apiCallbacks: ApiCallbacks
}

/**
 * @category API
 */
 export interface ApiCallbackResponse extends ApiResponse {
  apiCallback?: ApiCallback
}
/**
 * @category API
 */
 export interface ApiServersRequest extends ApiRequest {}


/**
 * @category API
 */
 export interface ApiServersResponse extends ApiResponse {
  [ServerType.Api]?: ApiServerInit
  [ServerType.Data]?: DataServerInit
  [ServerType.File]?: JsonRecord
  [ServerType.Rendering]?: JsonRecord
  [ServerType.Web]?: JsonRecord
}
