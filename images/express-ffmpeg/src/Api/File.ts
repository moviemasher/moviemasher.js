import { ApiRequest, ApiResponse } from './Api.js'

export interface FileStoreRequest extends ApiRequest {
  id?: string
}

export interface FileStoreResponse extends ApiResponse {}
