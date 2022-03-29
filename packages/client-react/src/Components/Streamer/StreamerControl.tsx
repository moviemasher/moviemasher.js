import React from "react"
import {
  StreamingStartRequest, StreamingStartResponse,
  StreamingStatusRequest, StreamingStatusResponse, Endpoints
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { ViewerContext } from "../../Contexts/ViewerContext"

interface StreamerControlProps extends PropsAndChildren, WithClassName {

}
function StreamerControl(props: StreamerControlProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const viewerContext = React.useContext(ViewerContext)

  const { setProcessing, processing, setStatus } = processContext
  const [disabled, setDisabled] = React.useState(processing)
  const { endpointPromise } = apiContext
  const { setStreaming, setId, setUrl, setWidth, setHeight, setVideoRate } = viewerContext

  const startStreaming = () => {
    const request: StreamingStartRequest = {}
    // console.debug("StreamingStartRequest", Endpoints.streaming.start, request)
    endpointPromise(Endpoints.streaming.start, request).then((response: StreamingStartResponse) => {
      // console.debug("StreamingStartResponse", Endpoints.streaming.start, response)
      setStatus(`Started stream`)
      const { id, readySeconds, width, height, videoRate } = response
      setId(id)
      setWidth(width)
      setHeight(height)
      setVideoRate(videoRate)
      const monitorStream = () => {
        setTimeout(() => {
          const request: StreamingStatusRequest = { id }
          // console.debug('StreamingStatusRequest', Endpoints.streaming.status, request)
          endpointPromise(Endpoints.streaming.status, request).then((response: StreamingStatusResponse) => {
            // console.debug("StreamingStatusResponse", Endpoints.streaming.status, response)
            const { streamUrl } = response
            if (streamUrl) {
              setUrl(streamUrl)
              setStreaming(true)
              setProcessing(true)
              setStatus(`Streaming`)
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

export { StreamerControl, StreamerControlProps }
