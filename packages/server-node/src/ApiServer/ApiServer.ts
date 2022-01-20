import express from "express"
import {
  ApiServerRequest, ApiInit, ServerType, ServerTypes,
  ApiServerResponse, ApiServersResponse,
} from "@moviemasher/moviemasher.js"

import { ServerHandler, ApiServerArgs, Server, ServersObject } from "../declaration"

class ApiServer implements Server {
  constructor(serversObject: ServersObject, activeServers: Server[]) {
    this.serversObject = serversObject
    if (this.serversObject.api) this.api = this.serversObject.api
    this.activeServers = activeServers
  }

  private api: ApiServerArgs = { prefix: '/api' }

  id = 'api'

  init(): ApiInit { return {} }

  private activeServers: Server[]

  private serversObject: ServersObject = {}

  server: ServerHandler<ApiServerResponse, ApiServerRequest> = (req, res) => {
    const request = req.body as ApiServerRequest
    const { id } = request
    if (!ServerTypes.map(String).includes(id)) throw 'ServerType'

    const serverType = id as ServerType
    const serverObject = this.serversObject[serverType]
    if (!serverObject) throw 'serverObject'

    const { prefix, host, port, protocol } = serverObject
    const response: ApiServerResponse = { prefix, host, port, protocol }
    res.send(response)
  }

  servers: ServerHandler<ApiServersResponse> = (_, res) => {
    const response: ApiServersResponse = Object.fromEntries(
      this.activeServers.map(server => ([server.id, server.init()]))
    )
    res.send(response)
  }

  start(app:express.Application):void {
    if (this.api.prefix) {
      app.post(`${this.api.prefix}/server`, this.server)
      app.get(`${this.api.prefix}/servers`, this.servers)
    }
  }

  stop(): void {}
}

export { ApiServer, ApiServerArgs }
