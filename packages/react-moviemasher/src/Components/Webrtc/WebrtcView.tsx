import React from "react"
import { RemoteServer } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { WebrtcContext, WebrtcContextDefault } from "../../Contexts/WebrtcContext"
import { HostsContext } from "../../Contexts/HostsContext"

interface WebrtcProps {
  remoteServer?: RemoteServer
}

const WebrtcView: React.FunctionComponent<WebrtcProps> = props => {
  const [broadcasting, setBroadcasting] = React.useState(false)
  const [status, setStatus] = React.useState('')
  const hostsContext = React.useContext(HostsContext)
  const { enabled } = hostsContext
  if (!enabled.includes('webrtc')) return null

  const { remoteServer, ...rest } = props
  const { remoteServerPromise } = hostsContext
  const serverPromise = (id: string): Promise<RemoteServer> => {
    if (remoteServer) return Promise.resolve(remoteServer)

    return remoteServerPromise(id)
  }

  const { webrtcClient } = WebrtcContextDefault
  const webrtcContext = {
    webrtcClient,
    broadcasting, setBroadcasting,
    remoteServerPromise: serverPromise,
    status, setStatus,
  }

  return (
    <WebrtcContext.Provider value={webrtcContext}>
      <View {...rest} />
    </WebrtcContext.Provider>
  )
}

export { WebrtcView }
