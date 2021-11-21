import React from "react"

import { View } from "../../Utilities/View"
import { WebcamContext, WebcamContextDefault } from "./WebcamContext"
import { RemoteServer } from "../../declarations"

interface WebcamProps {
  remoteServer: RemoteServer
}

const WebcamPanel: React.FunctionComponent<WebcamProps> = props => {
  const { remoteServer, ...rest } = props
  const [streaming, setStreaming] = React.useState(false)
  const { streamerClient } = WebcamContextDefault
  const protocol = remoteServer.protocol || 'http'
  const host = remoteServer.host || 'localhost'
  const port = remoteServer.port || 8570
  streamerClient.host = `${protocol}://${host}:${port}`
  streamerClient.prefix = remoteServer.prefix || '/webrtc'

  const streamerContext = { ...WebcamContextDefault, streaming, setStreaming }
  return (
    <WebcamContext.Provider value={streamerContext}>
      <View {...rest} />
    </WebcamContext.Provider>
  )
}

export { WebcamPanel }
