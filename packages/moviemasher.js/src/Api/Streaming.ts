import { DefinitionObjects } from "../Definition/Definition"
import { AndId } from "../declarations"
import { GraphFiles } from "../MoveMe"
import { MashObject } from "../Edited/Mash/Mash"
import { CommandOutput } from "../Output/Output"
import { StreamingFormat } from "../Setup/Enums"
import { ApiRequest, ApiResponse } from "./Api"
import { CommandDescription } from "./Rendering"


export interface StreamingStartRequest extends ApiRequest {
  format?: StreamingFormat
  width?: number
  height?: number
  videoRate?: number
}
export interface StreamingStartResponse extends ApiResponse, AndId {
  readySeconds: number
  width: number
  height: number
  videoRate: number
  format: StreamingFormat

}

export interface StreamingStatusRequest extends ApiRequest, AndId {}
export interface StreamingStatusResponse  extends ApiRequest   {
  streamUrl?: string
}

export interface StreamingPreloadRequest extends ApiRequest, AndId {
  files: GraphFiles
}
export interface StreamingPreloadResponse extends ApiResponse  {}

export interface StreamingCutRequest extends ApiRequest {
  mashObjects: MashObject[]
  definitionObjects: DefinitionObjects
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

export interface StreamingDescription extends CommandDescription {
  commandOutput: CommandOutput
}
