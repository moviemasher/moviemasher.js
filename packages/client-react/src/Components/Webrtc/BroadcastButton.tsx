import React from "react"

import { View } from "../../Utilities/View"
import { WebrtcContext } from "../../Contexts/WebrtcContext"
import { PropsWithChildren, ReactResult } from "../../declarations"
import { ServerType } from "@moviemasher/moviemasher.js"

function BroadcastButton(props: PropsWithChildren): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  const {
    broadcasting, setBroadcasting, webrtcClient, setStatus, serverOptionsPromise
  } = webrtcContext

  const onClick = () => {
    if (broadcasting) {
      webrtcClient.closeConnection()
      setBroadcasting(false)
    } else {
      setStatus('Fetching webrtc host')
      serverOptionsPromise(ServerType.Webrtc).then(serverOptions => {
        console.log("BroadcastButton serverOptionsPromise", serverOptions)
        webrtcClient.serverOptions = serverOptions
        webrtcClient.createConnection().then(() => {
          setBroadcasting(true)
          console.log("BroadcastButton createConnection")
        })
      })
    }
  }

  const broadcastingOptions = { ...props, onClick }
  return <View {...broadcastingOptions} />
}

export { BroadcastButton }
