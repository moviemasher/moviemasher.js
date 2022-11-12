import React from "react"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { ApiContext } from "../ApiClient/ApiContext"
import { WebrtcContext } from "./WebrtcContext"
import { WebrtcClient } from "./WebrtcClient"
import { View } from "../../Utilities/View"

export function WebrtcButton(props: PropsWithChildren): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  
  const apiContext = React.useContext(ApiContext)

  const { endpointPromise } = apiContext
  const { client, setClient, broadcasting, setBroadcasting, mediaStream } = webrtcContext

  const onClick = () => {
    if (broadcasting) {
      console.log("WebrtcButton onClick closing WebRTC connection")
      client?.closeConnection()
      setBroadcasting(false)
      setClient(undefined)
    } else {
      console.log("WebrtcButton onClick opening WebRTC connection...", mediaStream?.id)
      const client = new WebrtcClient(endpointPromise, mediaStream)
      client.createConnection().then(() => {
        console.log("WebrtcButton onClick.createConnection opened WebRTC connection")
        setBroadcasting(true)
        setClient(client)
      })
    }
  }

  const broadcastingOptions = { ...props, onClick }
  return <View {...broadcastingOptions} />
}
