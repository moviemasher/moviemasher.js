import { ApiRequest, ApiResponse } from "./Api"

export interface FileStoreRequest extends ApiRequest {
  id?: string
}

export interface FileStoreResponse extends ApiResponse {}
