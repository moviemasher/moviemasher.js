import React from 'react'
import { BooleanSetter } from '@moviemasher/moviemasher.js'
import { WebcamClient } from './WebcamClient'

interface WebcamContextInterface {
  streamerClient: WebcamClient
  streaming: boolean
  setStreaming: BooleanSetter
 }

const WebcamContextDefault: WebcamContextInterface = {
  streamerClient: new WebcamClient(),
  streaming: false, setStreaming: () => { }
}

const WebcamContext = React.createContext(WebcamContextDefault)

export { WebcamContext, WebcamContextInterface, WebcamContextDefault }
