import {
  ApiCallbacksRequest, ApiCallbacksResponse, ApiServersRequest, ApiServersResponse,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ExpressHandler } from "../../src/Server/Server"

export interface ApiServerArgs extends ServerArgs {}

export interface ApiServer extends Server {
  args: ApiServerArgs
  callbacks: ExpressHandler<ApiCallbacksResponse, ApiCallbacksRequest>
  servers: ExpressHandler<ApiServersResponse, ApiServersRequest>
}
