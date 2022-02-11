import React from "react"
import {
  StreamingPreloadRequest, StreamingPreloadResponse,
  GraphType, FilterGraphsArgs, Endpoints, FilterGraphArgs, TimeRange, AVType
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { useCastEditor } from "../../Hooks/useCastEditor"
import { ViewerContext } from "../../Contexts/ViewerContext"
import { GraphFile } from "@moviemasher/moviemasher.js"

interface StreamerPreloadControlProps extends PropsAndChildren, WithClassName { }

function StreamerPreloadControl(props: StreamerPreloadControlProps): ReactResult {
  const editor = useCastEditor()
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const viewerContext = React.useContext(ViewerContext)
  const { id, setPreloading, width, height, videoRate, preloading, updating, streaming } = viewerContext
  const { setStatus } = processContext
  const { endpointPromise } = apiContext

  const preload = () => {
    const graphType = GraphType.Cast
    const size = { width, height }
    const { cast } = editor
    const timeRange = TimeRange.fromArgs()
    const filterGraphArgs: FilterGraphArgs = {
      avType: AVType.Both,
      graphType, size, videoRate, timeRange
    }
    const filterGraph = cast.filterGraph(filterGraphArgs)
    const files: GraphFile[] = filterGraph.filterChains.flatMap(chain => chain.files)

    const request: StreamingPreloadRequest = {
      files, id
    }
    setStatus(`Preloading...`)
    console.debug("StreamingPreloadRequest", Endpoints.streaming.preload, request)
    endpointPromise(Endpoints.streaming.preload, request).then((response:StreamingPreloadResponse) => {
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
StreamerPreloadControl
export { StreamerPreloadControl, StreamerPreloadControlProps }
