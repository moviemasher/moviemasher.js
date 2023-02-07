import {
  Size,
  RenderingStartRequest, RenderingStartResponse,
  RenderingStatusResponse, RenderingStatusRequest,
  RenderingUploadRequest, RenderingUploadResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ExpressHandler } from "../Server"
import { RenderingCommandOutputRecord } from "./RenderingServerClass"


export interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
  temporaryDirectory: string
  previewSize?: Size
  outputSize?: Size
  iconSize?: Size
  commandOutputs: RenderingCommandOutputRecord
}

export interface RenderingServer extends Server {
  args: RenderingServerArgs
  start: ExpressHandler<RenderingStartResponse, RenderingStartRequest>
  status: ExpressHandler<RenderingStatusResponse, RenderingStatusRequest>
  upload: ExpressHandler<RenderingUploadResponse, RenderingUploadRequest>
}
