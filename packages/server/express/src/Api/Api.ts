
import { JsonRecord } from '../Types/Core.js'
import { Identified } from '../Base/Identified.js'
import { PotentialError } from '../Helpers/Error/Error.js'
import { DataServerInit } from './Data.js'
import { EndpointRequest } from '../Helpers/Request/Request.js'

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
 export interface ApiCallback extends EndpointRequest {
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
  api?: ApiServerInit
  data?: DataServerInit
  file?: JsonRecord
  rendering?: JsonRecord
  web?: JsonRecord
}
