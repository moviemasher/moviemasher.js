import React from "react"
import {
  StreamingCutRequest, StreamingCutResponse,
  GraphType, Endpoints, FilterGraphArgs, TimeRange, AVType
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { useCastEditor } from "../../Hooks/useCastEditor"
import { ViewerContext } from "../../Contexts/ViewerContext"
interface StreamerUpdateControlProps extends PropsAndChildren, WithClassName {}
function StreamerUpdateControl(props: StreamerUpdateControlProps): ReactResult {
  const caster = useCastEditor()
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const viewerContext = React.useContext(ViewerContext)
  const { updating, setUpdating, streaming, preloading, id, width, height, videoRate } = viewerContext

  const { setStatus } = processContext
  const { endpointPromise } = apiContext

  const update = () => {
    const size = { width, height }
    const { cast } = caster
    setStatus(`Loading segment`)
    const graphType = GraphType.Cast
    const timeRange = TimeRange.fromArgs()
    const filterGraphArgs: FilterGraphArgs = {
      avType: AVType.Both,
      graphType, size, videoRate, timeRange
    }
    const filterGraph = cast.filterGraph(filterGraphArgs)
    const request: StreamingCutRequest = { filterGraph, id }
    console.debug('StreamingCutRequest', Endpoints.streaming.cut, request)
    setStatus(`Updating stream`)
    endpointPromise(Endpoints.streaming.cut, request).then((response:StreamingCutResponse) => {
      console.debug("StreamingCutResponse", Endpoints.streaming.cut, response)
      setStatus(`Updated stream`)
      setUpdating(false)
    })
  }

  const disabled = updating || preloading || !streaming
  const onClick = () => {
    if (disabled) return

    setUpdating(true)
    update()
  }

  const viewProps = { ...props, onClick, disabled }
  return <View {...viewProps} />
}

export { StreamerUpdateControl }
