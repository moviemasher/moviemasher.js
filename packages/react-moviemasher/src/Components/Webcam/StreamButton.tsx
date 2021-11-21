import { UnknownObject } from "@moviemasher/moviemasher.js"
import React from "react"
import { View } from "../../Utilities/View"
import { WebcamContext } from "./WebcamContext"

const StreamButton : React.FunctionComponent<UnknownObject> = (props) => {
  const streamerContext = React.useContext(WebcamContext)
  const { streaming, setStreaming, streamerClient } = streamerContext
  const onClick = () => {
    if (streaming) {
      streamerClient.closeConnection()
      setStreaming(false)
    } else {
      streamerClient.createConnection().then(() => {
        setStreaming(true)
      })
    }

  }
  const streamingOptions = {
    ...props, onClick,
  }
  return <View {...streamingOptions} />
}

export { StreamButton }
