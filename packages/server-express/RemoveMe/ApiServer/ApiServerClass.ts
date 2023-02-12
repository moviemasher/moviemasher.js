import Express from "express"
import {
  ApiServerInit,
  ApiCallbacksRequest, ApiCallbacksResponse,
  ApiServersRequest, ApiServersResponse, Endpoints, ServerType, ApiCallbacks, errorCaught,
} from "@moviemasher/moviemasher.js"

import { ServerClass } from "../../src/Server/ServerClass"
import { HostServers } from "../../src/Host/Host"
import { ApiServer, ApiServerArgs } from "./ApiServer"
import { ExpressHandler } from "../../src/Server/Server"

export class ApiServerClass extends ServerClass implements ApiServer {
  constructor(public args: ApiServerArgs) { super(args) }

  id = 'api'

  init(): ApiServerInit { return {} }

  private activeServers: HostServers = {}

  callbacks: ExpressHandler<ApiCallbacksResponse, ApiCallbacksRequest> = (req, res) => {
    const request = req.body
    const { id } = request
    const apiCallbacks: ApiCallbacks = {}
    const keys = Object.keys(this.activeServers)
    const [_, serverId] = id.split('/')
    if (keys.includes(serverId)) apiCallbacks[id] = { endpoint: { pathname: id } }
    const response: ApiCallbacksResponse = { apiCallbacks }
    res.send(response)
  }

  servers: ExpressHandler<ApiServersResponse, ApiServersRequest> = (req, res) => {
    const response: ApiServersResponse = {}
    try {
      const user = this.userFromRequest(req)

      Object.entries(this.activeServers).forEach(([serverType, server]) => {
        response[serverType as ServerType] = server.init(user)
      })

    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      this.activeServers = activeServers
      app.post(Endpoints.api.callbacks, this.callbacks)
      app.post(Endpoints.api.servers, this.servers)
    })
  }
}
