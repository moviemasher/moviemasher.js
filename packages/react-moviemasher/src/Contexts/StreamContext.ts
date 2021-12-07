import React from 'react'
import { BooleanSetter, RemoteServer, StringSetter } from '@moviemasher/moviemasher.js'

interface StreamContextInterface {
  streaming: boolean
  status: string
  setStatus: StringSetter
  setStreaming: BooleanSetter
  remoteServerPromise: (id:string) => Promise<RemoteServer>
}

const StreamContextDefault: StreamContextInterface = {
  streaming: false,
  status: '',
  setStatus: () => {},
  setStreaming: () => {},
  remoteServerPromise: () => Promise.resolve({})
}

const StreamContext = React.createContext(StreamContextDefault)

export { StreamContext, StreamContextInterface, StreamContextDefault }
