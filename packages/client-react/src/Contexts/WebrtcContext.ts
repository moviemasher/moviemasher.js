import React from 'react'

import { WebrtcClient } from '../Components/Webrtc/WebrtcClient'

export interface WebrtcContextInterface {
  client?: WebrtcClient
  setClient: (client: WebrtcClient | undefined) => void
 }

export const WebrtcContextDefault: WebrtcContextInterface = {
  setClient: () => {}
}

export const WebrtcContext = React.createContext(WebrtcContextDefault)
