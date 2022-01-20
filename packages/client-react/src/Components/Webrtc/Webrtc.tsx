import React from "react"
import { ServerOptions, ServerType } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { WebrtcContext, WebrtcContextDefault } from "../../Contexts/WebrtcContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { PropsWithChildren } from "../../declarations"

interface WebrtcProps extends PropsWithChildren {
  serverOptions?: ServerOptions
}

function Webrtc(props: WebrtcProps) {
  const [broadcasting, setBroadcasting] = React.useState(false)
  const [status, setStatus] = React.useState('')
  const apiContext = React.useContext(ApiContext)
  const { enabled } = apiContext
  if (!enabled.includes(ServerType.Webrtc)) return null

  const { serverOptions, ...rest } = props
  const { serverOptionsPromise } = apiContext
  const serverPromise = (id: ServerType): Promise<ServerOptions> => {
    if (serverOptions) return Promise.resolve(serverOptions)

    return serverOptionsPromise(id)
  }

  const { webrtcClient } = WebrtcContextDefault
  const webrtcContext = {
    webrtcClient,
    broadcasting, setBroadcasting,
    serverOptionsPromise: serverPromise,
    status, setStatus,
  }

  return (
    <WebrtcContext.Provider value={webrtcContext}>
      <View {...rest} />
    </WebrtcContext.Provider>
  )
}

export { Webrtc, WebrtcProps }
