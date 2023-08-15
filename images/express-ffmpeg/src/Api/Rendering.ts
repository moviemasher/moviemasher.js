import type { RenderingOptions } from '@moviemasher/lib-shared'
import type { LoadType } from '@moviemasher/runtime-shared'
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
