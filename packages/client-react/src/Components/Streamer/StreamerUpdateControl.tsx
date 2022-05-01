import React from "react"
import {
  StreamingCutRequest, StreamingCutResponse, Endpoints
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { useCastEditor } from "../../Hooks/useCastEditor"
import { ViewerContext } from "../../Contexts/ViewerContext"

export interface StreamerUpdateControlProps extends PropsAndChildren, WithClassName { }

export function StreamerUpdateControl(props: StreamerUpdateControlProps): ReactResult {
  const caster = useCastEditor()
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const viewerContext = React.useContext(ViewerContext)
  // , width, height, videoRate
  const { updating, setUpdating, streaming, preloading, id } = viewerContext

  const { setStatus } = processContext
  const { endpointPromise } = apiContext

  const update = () => {
    const { edited } = caster
    const { mashes } = edited
    const definitions = mashes.flatMap(mash => mash.definitions)
    const definitionObjects = definitions.map(definition => definition.toJSON())
    const mashObjects = mashes.map(mash => mash.toJSON())
    const request: StreamingCutRequest = { definitionObjects, mashObjects, id }
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
