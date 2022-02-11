import { FilterGraph, AndId, GraphFile, AndType } from "../declarations"
import { OutputFormat } from "../Setup/Enums"
import { ApiRequest, ApiResponse } from "./Api"


export interface StreamingStartRequest extends ApiRequest {
  width?: number
  height?: number
}
export interface StreamingStartResponse extends ApiResponse, AndId {
  readySeconds: number
  width: number
  height: number
  videoRate: number
}

export interface StreamingStatusRequest extends ApiRequest, AndId {}
export interface StreamingStatusResponse  extends ApiRequest   {
  streamUrl?: string
}

export interface StreamingPreloadRequest extends ApiRequest, AndId {
  files: GraphFile[]
}
export interface StreamingPreloadResponse extends ApiResponse  {}


export interface StreamingCutRequest extends ApiRequest {
  filterGraph: FilterGraph
}
export interface StreamingCutResponse extends ApiResponse {}

export interface StreamingSaveRequest extends ApiRequest { }
export interface StreamingSaveResponse extends ApiResponse { }

export interface StreamingDeleteRequest extends ApiRequest, AndId {}
export interface StreamingDeleteResponse extends ApiResponse { }

export interface StreamingListRequest extends ApiRequest { }
export interface StreamingListResponse extends ApiResponse { }

export interface StreamingWebrtcRequest extends ApiRequest {}
export interface StreamingWebrtcResponse extends ApiResponse, AndId {
  localDescription: RTCSessionDescription
}

export interface StreamingRtmpRequest extends ApiRequest { }
export interface StreamingRtmpResponse extends ApiResponse { }


export interface StreamingRemoteRequest extends ApiRequest, AndId {
  localDescription: RTCSessionDescription
}
export interface StreamingRemoteResponse extends ApiResponse {
  localDescription: RTCSessionDescription
}

export interface StreamingLocalRequest extends ApiRequest, AndId {
  localDescription: RTCSessionDescription
}
export interface StreamingLocalResponse extends ApiResponse {
  localDescription: RTCSessionDescription
}
