import { StringRecord } from "@moviemasher/moviemasher.js"

import { Server, ServerArgs } from "../Server"


export interface WebServerArgs extends ServerArgs {
  sources: StringRecord
}

export interface WebServer extends Server {
  args: WebServerArgs
}
