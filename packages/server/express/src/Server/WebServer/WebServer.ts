import { StringRecord } from "@moviemasher/lib-core"

import { Server, ServerArgs } from "../Server"


export interface WebServerArgs extends ServerArgs {
  sources: StringRecord
}

export interface WebServer extends Server {
  args: WebServerArgs
}
