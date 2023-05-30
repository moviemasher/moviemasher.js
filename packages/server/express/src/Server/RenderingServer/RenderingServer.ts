import {
  Size,

} from "@moviemasher/lib-core"

import { Server, ServerArgs, ExpressHandler } from "../Server"
import { OutputOptionsRecord } from "./RenderingServerClass"
import { RenderingStartRequest, RenderingStartResponse, RenderingUploadRequest, RenderingUploadResponse } from "../../Api/Rendering"


export interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
  temporaryDirectory: string
  previewSize?: Size
  outputSize?: Size
  iconSize?: Size
  outputOptions: OutputOptionsRecord
}

export interface RenderingServer extends Server {
  args: RenderingServerArgs
  start: ExpressHandler<RenderingStartResponse, RenderingStartRequest>
  // status: ExpressHandler<RenderingStatusResponse, RenderingStatusRequest>
  upload: ExpressHandler<RenderingUploadResponse, RenderingUploadRequest>
}
