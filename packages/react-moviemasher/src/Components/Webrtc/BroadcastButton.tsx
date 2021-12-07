import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { WebrtcContext } from "../../Contexts/WebrtcContext"

const BroadcastButton : React.FunctionComponent<UnknownObject> = props => {
  const webrtcContext = React.useContext(WebrtcContext)
  const {
    broadcasting, setBroadcasting, webrtcClient, setStatus, remoteServerPromise
  } = webrtcContext

  const onClick = () => {
    if (broadcasting) {
      webrtcClient.closeConnection()
      setBroadcasting(false)
    } else {
      setStatus('Fetching webrtc host')
      remoteServerPromise('webrtc').then(remoteServer => {
        console.log("BroadcastButton remoteServerPromise", remoteServer)
        webrtcClient.remoteServer = remoteServer
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
