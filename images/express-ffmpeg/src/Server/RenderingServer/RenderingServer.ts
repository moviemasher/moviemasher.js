import type { Size, } from '@moviemasher/runtime-shared'
import type { RenderingStartRequest, RenderingStartResponse, RenderingUploadRequest, RenderingUploadResponse } from '../../Api/Rendering.js'
import type { ExpressHandler, Server, ServerArgs } from '../Server.js'
import type { OutputOptionsRecord } from './RenderingServerClass.js'

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
