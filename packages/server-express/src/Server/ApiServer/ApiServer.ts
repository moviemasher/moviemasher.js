import Express from "express"
import {
  ApiServerInit,
  ApiEndpointRequest, ApiEndpointResponse,
  ApiServersRequest, ApiServersResponse, Endpoints,
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { ServerClass } from "../ServerClass"
import { Server, ServerArgs } from "../Server"
import { HostServers } from "../../Host/Host"

interface ApiServerArgs extends ServerArgs {}

class ApiServer  extends ServerClass {
  declare args: ApiServerArgs

  id = 'api'

  init(): ApiServerInit { return {} }

  private activeServers: HostServers = {}

  callbacks: ServerHandler<ApiEndpointResponse, ApiEndpointRequest> = (req, res) => {
    const request = req.body
    const { id } = request

    const response: ApiEndpointResponse = {
      apiCallbacks: { [id]: { endpoint: { prefix: id } } }
    }
    res.send(response)
  }

  servers: ServerHandler<ApiServersResponse, ApiServersRequest> = (_, res) => {
    const response: ApiServersResponse = Object.fromEntries(
      Object.entries(this.activeServers).map(([serverType, server]) => (
        [serverType, server.init()]
      ))
    )
    res.send(response)
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.activeServers = activeServers
    app.post(Endpoints.api.callbacks, this.callbacks)
    app.post(Endpoints.api.servers, this.servers)
  }
}

export { ApiServer, ApiServerArgs }
