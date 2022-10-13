import {
  ApiCallbacksRequest, ApiCallbacksResponse, ApiServersRequest, ApiServersResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ServerHandler } from "../Server"

export interface ApiServerArgs extends ServerArgs {}

export interface ApiServer extends Server {
  args: ApiServerArgs
  callbacks: ServerHandler<ApiCallbacksResponse, ApiCallbacksRequest>
  servers: ServerHandler<ApiServersResponse, ApiServersRequest>
}
