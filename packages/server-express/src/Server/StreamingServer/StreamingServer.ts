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

import { Server, ServerArgs, ServerHandler } from "../Server"
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
export interface StreamingServerArgs extends ServerArgs {
  streamingFormatOptions: StreamingFormatOptions
  appName: string
  httpOptions: UnknownObject
  rtmpOptions: UnknownObject
  commandOutput: CommandOutput
  webrtcStreamingDir: string
  cacheDirectory: string
}

export interface StreamingServer extends Server {
  args: StreamingServerArgs
  cut: ServerHandler<StreamingCutResponse, StreamingCutRequest>
  delete: ServerHandler<StreamingDeleteResponse, StreamingDeleteRequest>
  remote: ServerHandler<StreamingRemoteResponse | WithError, StreamingRemoteRequest>
  local: ServerHandler<StreamingLocalResponse | WithError, StreamingLocalRequest>
  preload: ServerHandler<StreamingPreloadResponse, StreamingPreloadRequest>
  start: ServerHandler<StreamingStartResponse, StreamingStartRequest>
  status: ServerHandler<StreamingStatusResponse, StreamingStatusRequest>
  webrtc: ServerHandler<WebrtcConnection | WithError, StreamingWebrtcRequest>
}
