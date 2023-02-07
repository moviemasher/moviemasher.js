import React from "react"
import {
  StreamingStartRequest, StreamingStartResponse,
  StreamingStatusRequest, StreamingStatusResponse, Endpoints
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../ApiClient/ApiContext"
import { MasherContext } from "../Masher/MasherContext"

export interface BroadcasterControlProps extends PropsAndChildren, WithClassName {}

export function BroadcasterControl(props: BroadcasterControlProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const masherContext = React.useContext(MasherContext)

  const { setProcessing, processing } = processContext
  const [disabled, setDisabled] = React.useState(processing)
  const { endpointPromise } = apiContext
  const { current, setStreaming } = masherContext


  const startStreaming = () => {
    const request: StreamingStartRequest = {}
    console.debug("StreamingStartRequest", Endpoints.streaming.start, request)
    endpointPromise(Endpoints.streaming.start, request).then((response: StreamingStartResponse) => {
      console.debug("StreamingStartResponse", Endpoints.streaming.start, response)
      const { id, readySeconds, width, height, videoRate } = response

      current.streamId = id
      current.streamWidth = width
      current.streamheight = height
      current.streamRate = videoRate
      
      const monitorStream = () => {
        setTimeout(() => {
          const request: StreamingStatusRequest = { id }
          console.debug('StreamingStatusRequest', Endpoints.streaming.status, request)
          endpointPromise(Endpoints.streaming.status, request).then((response: StreamingStatusResponse) => {
            console.debug("StreamingStatusResponse", Endpoints.streaming.status, response)
            const { streamUrl } = response
            if (streamUrl) {
              current.streamUrl = streamUrl
              setStreaming(true)
            
              setProcessing(true)
            }
            else monitorStream()
          })
        }, 1000 * readySeconds)
      }
      monitorStream()
    })
  }

  const onClick = () => {
    if (disabled) return

    setDisabled(true)
    startStreaming()
  }

  const viewProps = { ...props, onClick, disabled }
  return <View {...viewProps} />
}
