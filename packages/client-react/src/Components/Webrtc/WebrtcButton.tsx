import React from "react"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { ApiContext } from "../../Contexts/ApiContext"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { WebrtcContext } from "../../Contexts/WebrtcContext"
import { WebrtcClient } from "./WebrtcClient"
import { View } from "../../Utilities/View"

export function WebrtcButton(props: PropsWithChildren): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)

  const { setStatus, processing, setProcessing } = processContext
  const { endpointPromise } = apiContext
  const { client, setClient } = webrtcContext

  const onClick = () => {
    if (client) {
      setStatus("Closing WebRTC connection")
      client.closeConnection()
      setProcessing(false)
      setClient(undefined)
    } else {
      const client = new WebrtcClient(endpointPromise, setStatus)

      setStatus("Opening WebRTC connection...")
      client.createConnection().then(() => {
        setStatus("Opened WebRTC connection")
        setProcessing(true)
        setClient(client)
      })
    }
  }

  const broadcastingOptions = { ...props, onClick }
  return <View {...broadcastingOptions} />
}
