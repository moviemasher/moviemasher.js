import React from 'react'
import { BooleanSetter, ServerOptions, ServerType, StringSetter } from '@moviemasher/moviemasher.js'

import { WebrtcClient } from '../Components/Webrtc/WebrtcClient'

interface WebrtcContextInterface {
  broadcasting: boolean
  serverOptionsPromise: (id: ServerType) => Promise<ServerOptions>
  setBroadcasting: BooleanSetter
  setStatus: StringSetter
  status: string
  webrtcClient: WebrtcClient
 }

const WebrtcContextDefault: WebrtcContextInterface = {
  broadcasting: false, setBroadcasting: () => { },
  serverOptionsPromise: () => Promise.resolve({}),
  setStatus: () => {},
  status: '',
  webrtcClient: new WebrtcClient(),
}

const WebrtcContext = React.createContext(WebrtcContextDefault)

export { WebrtcContext, WebrtcContextInterface, WebrtcContextDefault }
