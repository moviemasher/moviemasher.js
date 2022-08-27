import React from 'react'
import { ApiServersResponse, JsonObject, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

export interface ApiContextInterface {
  exists: boolean,
  enabled: ServerType[]
  servers: ApiServersResponse
  endpointPromise: (id: string, body?: JsonObject, setStatus?: StringSetter) => Promise<any>
}

export const ApiContextDefault: ApiContextInterface = {
  exists: false,
  enabled: [],
  servers: {},
  endpointPromise: () => Promise.resolve({})
}

export const ApiContext = React.createContext(ApiContextDefault)
