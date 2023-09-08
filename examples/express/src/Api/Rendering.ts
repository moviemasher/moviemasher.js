import type { EncodeArgs } from '@moviemasher/runtime-server'
import type { DecodingObject, Identified, LoadType } from '@moviemasher/runtime-shared'
import type { UploadDescription } from '../Server/FileServer/FileServer.js'
import type { ApiCallback, ApiCallbackResponse, ApiRequest, ApiResponse } from './Api.js'
import type { EncodingObject, TranscodingObject } from '@moviemasher/runtime-shared'

export interface RenderingStartRequest extends ApiRequest, EncodeArgs {}

export interface RenderingStartResponse extends ApiResponse {
  data?: string
}

export interface RenderingUploadRequest extends ApiRequest, UploadDescription {
}
export interface RenderingUploadResponse extends ApiCallbackResponse {
  id?: string
  fileProperty?: string
  loadType?: LoadType
  fileApiCallback?: ApiCallback
}

export interface StatusRequest extends ApiRequest, Identified {}

export interface EncodeFinishResponse extends ApiResponse {
  data?: EncodingObject
}


export interface DecodeFinishResponse extends ApiResponse {
  data?: DecodingObject
}


export interface TranscodeFinishResponse extends ApiResponse {
  data?: TranscodingObject
}

