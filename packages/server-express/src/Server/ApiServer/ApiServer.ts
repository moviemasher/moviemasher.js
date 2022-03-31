import {
  ApiEndpointRequest, ApiEndpointResponse, ApiServersRequest, ApiServersResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ServerHandler } from "../Server"

export interface ApiServerArgs extends ServerArgs {}

export interface ApiServer extends Server {
  args: ApiServerArgs
  callbacks: ServerHandler<ApiEndpointResponse, ApiEndpointRequest>
  servers: ServerHandler<ApiServersResponse, ApiServersRequest>
}
