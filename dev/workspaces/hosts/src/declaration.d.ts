import Express from 'express'
import internal from 'stream'
import { Options, OutputOptions, StringObject, UnknownObject } from "@moviemasher/moviemasher.js"
import { FilterSpecification } from 'fluent-ffmpeg'

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
  start(app: Express.Application): void
  index():UnknownObject
}

export type CommandDestination = string | internal.Writable

export interface CommandInputOptions {
  source: string | internal.Readable
  options?: Options
}
export interface CommandArgs {
  inputs?: CommandInputOptions[]
  output: OutputOptions
  destination: CommandDestination
  complexFilter?: FilterSpecification[]
}

export interface WebrtcIngestorArgs extends UnknownObject {
  outputOptions?: OutputOptions
  outputPrefix?: string
  prefix?: string
}

export interface HostsServerArgs {
  prefix?: string
}

export interface RtmpIngestorArgs {
  app?: string
  httpOptions?: UnknownObject
  inputOptions?: UnknownObject
  outputOptions?: OutputOptions
  outputPrefix?: string
  prefix?: string
}

export interface StreamServerArgs {
  outputOptions?: OutputOptions
  outputPrefix?: string
  prefix?: string
}

export interface HlsServerArgs {
  prefix?: string
  inputPrefix?: string
}

export interface RenderServerArgs {
  prefix?: string
}
export interface CmsServerAuthentication extends UnknownObject {
  type?: string
  password?: string
  users?: StringObject
}

export interface CmsServerArgs {
  prefix?: string
  dbPath: string
  dbMigrationsPrefix?: string
  authentication?: CmsServerAuthentication
}

export interface ServersObject {
  hosts?: HostsServerArgs
  hls?: HlsServerArgs
  rtmp?: RtmpIngestorArgs
  stream?: StreamServerArgs
  render?: RenderServerArgs
  webrtc?: WebrtcIngestorArgs
}
