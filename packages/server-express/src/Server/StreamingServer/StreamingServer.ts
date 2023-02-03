import {
  CommandOutput,
  UnknownObject,
  StreamingStartResponse,
  StreamingPreloadResponse, StreamingPreloadRequest,
  StreamingCutRequest, StreamingCutResponse,
  StreamingStatusResponse, StreamingStatusRequest, StreamingDeleteRequest, StreamingDeleteResponse,
  StreamingRemoteRequest, StreamingRemoteResponse,
  StreamingLocalRequest, StreamingLocalResponse,
  StreamingWebrtcRequest, WithError, StreamingStartRequest,
  StreamingFormat} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ExpressHandler } from "../Server"
import { WebrtcConnection } from "./WebrtcConnection"

export interface FormatOptions {
  commandOutput: CommandOutput
  file: string
  segmentFile: string
  url: string
  directory: string
}

export type StreamingFormatOptions = {
  [index in StreamingFormat]: FormatOptions
}

/** @experimental */

export interface StreamingHttpOptions {
  port: number
  mediaroot: string
  allow_origin: string
}
export interface StreamingServerArgs extends ServerArgs {
  streamingFormatOptions: StreamingFormatOptions
  appName: string
  httpOptions: StreamingHttpOptions
  rtmpOptions: UnknownObject
  commandOutput: CommandOutput
  webrtcStreamingDir: string
  cacheDirectory: string
  temporaryDirectory: string
}

export interface StreamingServer extends Server {
  args: StreamingServerArgs
  cut: ExpressHandler<StreamingCutResponse, StreamingCutRequest>
  delete: ExpressHandler<StreamingDeleteResponse, StreamingDeleteRequest>
  remote: ExpressHandler<StreamingRemoteResponse | WithError, StreamingRemoteRequest>
  local: ExpressHandler<StreamingLocalResponse | WithError, StreamingLocalRequest>
  preload: ExpressHandler<StreamingPreloadResponse, StreamingPreloadRequest>
  start: ExpressHandler<StreamingStartResponse, StreamingStartRequest>
  status: ExpressHandler<StreamingStatusResponse, StreamingStatusRequest>
  webrtc: ExpressHandler<WebrtcConnection | WithError, StreamingWebrtcRequest>
}
