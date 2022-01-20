import React from 'react'
import { ServerOptions, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

interface ApiContextInterface {
  enabled: ServerType[]
  serverOptionsPromise: (id: ServerType, setStatus?: StringSetter) => Promise<ServerOptions>
}

const ApiContextDefault: ApiContextInterface = {
  enabled: [],
  serverOptionsPromise: () => Promise.resolve({})
}

const ApiContext = React.createContext(ApiContextDefault)

export { ApiContext, ApiContextInterface, ApiContextDefault }
