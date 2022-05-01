import React from "react"
import {
  StreamingPreloadRequest, StreamingPreloadResponse, Endpoints, GraphFiles
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { ViewerContext } from "../../Contexts/ViewerContext"

export interface StreamerPreloadControlProps extends PropsAndChildren, WithClassName { }

export function StreamerPreloadControl(props: StreamerPreloadControlProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const viewerContext = React.useContext(ViewerContext)
  const { id, setPreloading, preloading, updating, streaming } = viewerContext
  const { setStatus } = processContext
  const { endpointPromise } = apiContext

  const preload = () => {
    const files: GraphFiles = []

    const request: StreamingPreloadRequest = {
      files, id
    }
    setStatus(`Preloading...`)
    console.debug("StreamingPreloadRequest", Endpoints.streaming.preload, request)
    endpointPromise(Endpoints.streaming.preload, request).then((response: StreamingPreloadResponse) => {
      console.debug("StreamingPreloadResponse", Endpoints.streaming.preload, response)
      setStatus(`Preloaded`)
      setPreloading(false)
    })
  }

  const disabled = preloading || updating || !streaming
  const onClick = () => {
    if (disabled) return

    setPreloading(true)
    preload()
  }

  const viewProps = { ...props, onClick, disabled }
  return <View {...viewProps} />
}
