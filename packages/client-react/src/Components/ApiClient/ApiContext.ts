import React from 'react'
import { ApiServersResponse, JsonRecord, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

export interface ApiContextInterface {
  enabled: boolean
  servers: ApiServersResponse
  endpointPromise: (id: string, body?: JsonRecord) => Promise<any>
}

export const ApiContextDefault: ApiContextInterface = {
  enabled: false,
  servers: {},
  endpointPromise: () => Promise.resolve({})
}

export const ApiContext = React.createContext(ApiContextDefault)
