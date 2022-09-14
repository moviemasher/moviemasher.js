import React from "react"
import { ServerType } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, WithClassName } from "../../declarations"
import { WebrtcContext, WebrtcContextInterface } from "../../Contexts/WebrtcContext"
import { ApiContext } from "../ApiClient/ApiContext"
import { View } from "../../Utilities/View"
import { WebrtcClient } from "./WebrtcClient"

export interface WebrtcProps extends PropsAndChildren, WithClassName {}

export function Webrtc(props: WebrtcProps) {
  const [client, setClient] = React.useState<WebrtcClient | undefined>()
  const apiContext = React.useContext(ApiContext)

  const { enabled, servers } = apiContext
  if (!(enabled && servers[ServerType.Streaming])) return null

  const context: WebrtcContextInterface = { client, setClient }

  return (
    <WebrtcContext.Provider value={context}>
      <View {...props} />
    </WebrtcContext.Provider>
  )
}
