import React from 'react'

import { WebrtcClient } from '../Components/Webrtc/WebrtcClient'

interface WebrtcContextInterface {
  client?: WebrtcClient
  setClient: (client: WebrtcClient | undefined) => void
 }

const WebrtcContextDefault: WebrtcContextInterface = {
  setClient: () => {}
}

const WebrtcContext = React.createContext(WebrtcContextDefault)

export { WebrtcContext, WebrtcContextInterface, WebrtcContextDefault }
