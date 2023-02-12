import { Identified } from "../Base/Identified"
import { GraphFiles } from "../Base/Code"
import { MashMediaObject } from "../Media/Mash/Mash"
import { StreamingFormat } from "../Setup/Enums"
import { ApiRequest, ApiResponse } from "./Api"
import { MediaObjects } from "../Media/Media"

export interface StreamingStartRequest extends ApiRequest {
  format?: StreamingFormat
  width?: number
  height?: number
  videoRate?: number
}
export interface StreamingStartResponse extends ApiResponse, Identified {
  readySeconds: number
  width: number
  height: number
  videoRate: number
  format: StreamingFormat

}

export interface StreamingStatusRequest extends ApiRequest, Identified {}
export interface StreamingStatusResponse  extends ApiRequest   {
  streamUrl?: string
}

export interface StreamingPreloadRequest extends ApiRequest, Identified {
  files: GraphFiles
}
export interface StreamingPreloadResponse extends ApiResponse  {}

export interface StreamingCutRequest extends ApiRequest {
  mashObjects: MashMediaObject[]
  definitionObjects: MediaObjects
}
export interface StreamingCutResponse extends ApiResponse {}

export interface StreamingSaveRequest extends ApiRequest { }
export interface StreamingSaveResponse extends ApiResponse { }

export interface StreamingDeleteRequest extends ApiRequest, Identified {}
export interface StreamingDeleteResponse extends ApiResponse { }

export interface StreamingListRequest extends ApiRequest { }
export interface StreamingListResponse extends ApiResponse { }

export interface StreamingWebrtcRequest extends ApiRequest {}
export interface StreamingWebrtcResponse extends ApiResponse, Identified {
  localDescription: RTCSessionDescription
}

export interface StreamingRtmpRequest extends ApiRequest { }
export interface StreamingRtmpResponse extends ApiResponse { }


export interface StreamingRemoteRequest extends ApiRequest, Identified {
  localDescription: RTCSessionDescription
}
export interface StreamingRemoteResponse extends ApiResponse {
  localDescription: RTCSessionDescription
}

export interface StreamingLocalRequest extends ApiRequest, Identified {
  localDescription: RTCSessionDescription
}
export interface StreamingLocalResponse extends ApiResponse {
  localDescription: RTCSessionDescription
}
