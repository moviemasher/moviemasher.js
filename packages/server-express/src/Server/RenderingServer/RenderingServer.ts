import {
  OutputType, RenderingCommandOutput, Size,
  RenderingStartRequest, RenderingStartResponse,
  RenderingStatusResponse, RenderingStatusRequest,
  RenderingUploadRequest, RenderingUploadResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ServerHandler } from "../Server"

export type RenderingCommandOutputs = {
  [index in OutputType]?: RenderingCommandOutput
}

export interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
  commandOutputs?: RenderingCommandOutputs
  previewSize?: Size
  outputSize?: Size
  iconSize?: Size
}

export interface RenderingServer extends Server {
  args: RenderingServerArgs
  start: ServerHandler<RenderingStartResponse, RenderingStartRequest>
  status: ServerHandler<RenderingStatusResponse, RenderingStatusRequest>
  upload: ServerHandler<RenderingUploadResponse, RenderingUploadRequest>
}
