import { StringObject } from "@moviemasher/moviemasher.js"

import { Server, ServerArgs } from "../Server"


export interface WebServerArgs extends ServerArgs {
  sources: StringObject
}

export interface WebServer extends Server {
  args: WebServerArgs
}
