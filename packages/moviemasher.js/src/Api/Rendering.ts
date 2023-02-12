import { Identified } from "../Base/Identified"
import { RenderingOptions } from "../Encode/Encode"
import { LoadType, EncodeType } from "../Setup/Enums"
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

export type RenderingStatus = {
  [index in EncodeType]?: RenderingState
}



export interface RenderingStartRequest extends ApiRequest, RenderingOptions {}

export interface RenderingStartResponse extends ApiCallbackResponse {}

export interface RenderingStatusRequest extends ApiRequest, Identified {
  renderingId: string
}
export interface RenderingStatusResponse extends ApiCallbackResponse, RenderingStatus {}

export interface RenderingUploadRequest extends ApiRequest, UploadDescription {
}
export interface RenderingUploadResponse extends ApiCallbackResponse {
  id?: string
  fileProperty?: string
  loadType?: LoadType
  fileApiCallback?: ApiCallback
}
