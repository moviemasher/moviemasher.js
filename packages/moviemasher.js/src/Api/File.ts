import { ApiRequest, ApiResponse } from "./Api"

export interface FileStoreRequest extends ApiRequest {
  id?: string
  name?: string
  type?: string
}

export interface FileStoreResponse extends ApiResponse {}
