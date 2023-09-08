import type { ApiRequest, ApiResponse } from './Api.js'
import type { UploadDescription } from '../Server/FileServer/FileServer.js'
import type { EndpointRequest } from '@moviemasher/runtime-shared'

export interface FileStoreRequest extends ApiRequest {
  id?: string
}

export interface FileStoreResponse extends ApiResponse {}


export interface FileUploadRequest extends ApiRequest, UploadDescription {
  id?: string
}

export interface UploadResponse {
  id: string
  fileProperty?: string
  request: EndpointRequest 
  storeRequest: EndpointRequest 
}

export interface FileUploadResponse extends ApiResponse {
  data?: UploadResponse
}
