import React from 'react'
import { ApiServersResponse, JsonObject, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

interface ApiContextInterface {
  enabled: ServerType[]
  servers: ApiServersResponse
  endpointPromise: (id: string, body?: JsonObject, setStatus?: StringSetter) => Promise<any>
}

const ApiContextDefault: ApiContextInterface = {
  enabled: [],
  servers: {},
  endpointPromise: () => Promise.resolve({})
}

const ApiContext = React.createContext(ApiContextDefault)

export { ApiContext, ApiContextInterface, ApiContextDefault }
