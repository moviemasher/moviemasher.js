import type { LoadType, RenderingOptions } from '@moviemasher/lib-core'
import type { UploadDescription } from '../Server/FileServer/FileServer.js'
import type { ApiCallback, ApiCallbackResponse, ApiRequest } from './Api.js'


export interface RenderingStartRequest extends ApiRequest, RenderingOptions {}

export interface RenderingStartResponse extends ApiCallbackResponse {}

export interface RenderingUploadRequest extends ApiRequest, UploadDescription {
}
export interface RenderingUploadResponse extends ApiCallbackResponse {
  id?: string
  fileProperty?: string
  loadType?: LoadType
  fileApiCallback?: ApiCallback
}
