import express from "express"
import { v4 as uuid } from 'uuid'
import { isPopulatedObject, UnknownObject } from "@moviemasher/moviemasher.js"

import { HostsServerArgs, Server, ServersObject } from "../declaration"

class HostsServer implements Server {
  constructor(serversObject: ServersObject, servers: Server[]) {

    this.serversObject = serversObject
    if (this.serversObject.hosts) this.hosts = this.serversObject.hosts

    this.servers = servers
  }

  hosts: HostsServerArgs = { prefix: '/render' }

  index(): UnknownObject {
    return {
      enabled: Object.keys(this.serversObject).filter(key =>
         isPopulatedObject(this.serversObject[key])
      )
    }
  }

  servers: Server[]

  serversObject: ServersObject = {}

  start(app:express.Application):void {
   if (this.hosts.prefix) {
     app.get(this.hosts.prefix, (_req, res) => {
       const result = {}
       this.servers.forEach(server => {
        Object.assign(result, server.index())
       })
       res.send(result)
     })
     app.get(`${this.hosts.prefix}/:id`, (req, res) => {
       const { id } = req.params
       res.send(this.serversObject[id])
     })
   }
  }

  stop(): void {}
}

export { HostsServer, HostsServerArgs }
