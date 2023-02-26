import { RenderingOptions } from "../Encode/Encode"
import { LoadType } from "../Setup/Enums"
import { ApiCallback, ApiCallbackResponse, ApiRequest } from "./Api"


export interface UploadDescription {
  name: string
  type: string
  size: number
}

export interface RenderingState {
  total: number
  completed: number
}


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
