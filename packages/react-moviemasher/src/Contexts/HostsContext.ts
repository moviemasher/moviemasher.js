import React from 'react'
import { RemoteServer } from '@moviemasher/moviemasher.js'

interface HostsContextInterface {
  enabled: string[]
  servers: Record<string, RemoteServer>
  remoteServerPromise: (id:string) => Promise<RemoteServer>
}

const HostsContextDefault: HostsContextInterface = {
  enabled: [],
  servers: {},
  remoteServerPromise: () => Promise.resolve({})
}

const HostsContext = React.createContext(HostsContextDefault)

export { HostsContext, HostsContextInterface, HostsContextDefault }
