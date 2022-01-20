import express from 'express'
import {
  NumberObject, OutputObject, ServerType, ServerOptions, StringObject, UnknownObject,
  JsonObject, EditType
} from "@moviemasher/moviemasher.js"

export interface ConnectionJson {
  iceConnectionState: RTCIceConnectionState,
  id: string,
  localDescription: RTCSessionDescription | null,
  remoteDescription: RTCSessionDescription | null,
  signalingState: RTCSignalingState
  state: string,
}

export interface Server {
  stop() : void
  start(app: express.Application): void
  init(): JsonObject
  id: string
}
export type ServerHandler<T1, T2 = UnknownObject> = express.RequestHandler<UnknownObject, T1, T2, UnknownObject, UnknownObject>

export interface ContentServerArgs extends ServerOptions {
  authentication?: ContentServerAuthentication
  dbMigrationsPrefix?: string
  dbPath?: string
  uploadLimits?: NumberObject
  uploadsUrlPrefix?: string
}

export interface ApiServerArgs extends ServerOptions {}

export interface RtmpServerArgs extends ServerOptions {
  app?: string
  httpOptions?: UnknownObject
  inputOptions?: UnknownObject
  outputOptions?: OutputObject
  outputPrefix?: string
}

export type EditOutputObject = {
  [index in EditType]: OutputObject
}

export interface EncodeServerArgs extends ServerOptions {
  output?: EditOutputObject
  outputPrefix?: string
}

export interface HlsServerArgs extends ServerOptions {
  inputPrefix?: string
}

export interface StorageServerArgs extends ServerOptions {
  uploadsPrefix?: string
}

export interface WebrtcServerArgs extends ServerOptions {
  outputOptions?: OutputObject
  outputPrefix?: string
}

export interface ContentServerAuthentication extends UnknownObject {
  password?: string
  type?: string
  users?: StringObject
}

export interface ServersObject {
  [ServerType.Api]?: ApiServerArgs
  [ServerType.Hls]?: HlsServerArgs
  [ServerType.Rtmp]?: RtmpServerArgs
  [ServerType.Encode]?: EncodeServerArgs
  [ServerType.Storage]?: StorageServerArgs
  [ServerType.Webrtc]?: WebrtcServerArgs
  [ServerType.Content]?: ContentServerArgs
}
