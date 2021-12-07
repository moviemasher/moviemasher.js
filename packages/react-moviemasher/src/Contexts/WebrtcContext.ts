import React from 'react'
import { BooleanSetter, RemoteServer, StringSetter } from '@moviemasher/moviemasher.js'

import { WebrtcClient } from '../Components/Webrtc/WebrtcClient'

interface WebrtcContextInterface {
  broadcasting: boolean
  remoteServerPromise: (id:string) => Promise<RemoteServer>
  setBroadcasting: BooleanSetter
  setStatus: StringSetter
  status: string
  webrtcClient: WebrtcClient
 }

const WebrtcContextDefault: WebrtcContextInterface = {
  broadcasting: false, setBroadcasting: () => { },
  remoteServerPromise: () => Promise.resolve({}),
  setStatus: () => {},
  status: '',
  webrtcClient: new WebrtcClient(),
}

const WebrtcContext = React.createContext(WebrtcContextDefault)

export { WebrtcContext, WebrtcContextInterface, WebrtcContextDefault }
