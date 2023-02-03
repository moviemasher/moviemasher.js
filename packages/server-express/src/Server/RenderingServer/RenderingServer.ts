import {
  OutputType, RenderingCommandOutput, Size,
  RenderingStartRequest, RenderingStartResponse,
  RenderingStatusResponse, RenderingStatusRequest,
  RenderingUploadRequest, RenderingUploadResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ExpressHandler } from "../Server"

export type RenderingCommandOutputs = {
  [index in OutputType]?: RenderingCommandOutput
}

export interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
  temporaryDirectory: string
  commandOutputs?: RenderingCommandOutputs
  previewSize?: Size
  outputSize?: Size
  iconSize?: Size
}

export interface RenderingServer extends Server {
  args: RenderingServerArgs
  start: ExpressHandler<RenderingStartResponse, RenderingStartRequest>
  status: ExpressHandler<RenderingStatusResponse, RenderingStatusRequest>
  upload: ExpressHandler<RenderingUploadResponse, RenderingUploadRequest>
}
