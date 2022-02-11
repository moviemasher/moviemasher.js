import React from 'react'
import { JsonObject, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

interface ApiContextInterface {
  enabled: ServerType[]
  endpointPromise: (id: string, body?: JsonObject, setStatus?: StringSetter) => Promise<any>
}

const ApiContextDefault: ApiContextInterface = {
  enabled: [],
  endpointPromise: () => Promise.resolve({})
}

const ApiContext = React.createContext(ApiContextDefault)

export { ApiContext, ApiContextInterface, ApiContextDefault }
