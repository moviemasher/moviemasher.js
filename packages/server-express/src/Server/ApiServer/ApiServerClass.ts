import Express from "express"
import {
  ApiServerInit,
  ApiCallbacksRequest, ApiCallbacksResponse,
  ApiServersRequest, ApiServersResponse, Endpoints, ServerType, ApiCallbacks,
} from "@moviemasher/moviemasher.js"

import { ServerClass } from "../ServerClass"
import { HostServers } from "../../Host/Host"
import { ApiServer, ApiServerArgs } from "./ApiServer"
import { ServerHandler } from "../Server"

export class ApiServerClass extends ServerClass implements ApiServer {
  constructor(public args: ApiServerArgs) { super(args) }

  id = 'api'

  init(): ApiServerInit { return {} }

  private activeServers: HostServers = {}

  callbacks: ServerHandler<ApiCallbacksResponse, ApiCallbacksRequest> = (req, res) => {
    const request = req.body
    const { id } = request
    const apiCallbacks: ApiCallbacks = {}
    const keys = Object.keys(this.activeServers)
    const [_, serverId] = id.split('/')
    if (keys.includes(serverId)) apiCallbacks[id] = { endpoint: { prefix: id } }
    const response: ApiCallbacksResponse = { apiCallbacks }
    res.send(response)
  }

  servers: ServerHandler<ApiServersResponse, ApiServersRequest> = (req, res) => {
    const response: ApiServersResponse = {}
    try {
      const user = this.userFromRequest(req)

      Object.entries(this.activeServers).forEach(([serverType, server]) => {
        response[serverType as ServerType] = server.init(user)
      })

    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.activeServers = activeServers
    app.post(Endpoints.api.callbacks, this.callbacks)
    app.post(Endpoints.api.servers, this.servers)
  }
}
