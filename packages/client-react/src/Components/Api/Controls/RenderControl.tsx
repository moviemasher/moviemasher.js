import React from "react"
import {
  RenderingStartRequest, RenderingStartResponse,
  Endpoints,
  OutputType} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { ProcessContext } from "../../../Contexts/ProcessContext"
import { ApiContext } from "../../../Contexts/ApiContext"
import { useMashEditor } from "../../../Hooks/useMashEditor"


function RenderControl(props: PropsAndChild): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)

  const { children, ...rest } = props
  const { processing, setProcessing } = processContext
  const { endpointPromise } = apiContext
  const masher = useMashEditor()

  const onClick = () => {
    if (processing) return

    setProcessing(true)
    const request: RenderingStartRequest = {
      mash: masher.mash.toJSON(),
      definitions: masher.mash.definitions.map(definition => definition.toJSON()),
      input: { type: 'mash', mash: masher.mash },
      outputs: [{outputType: OutputType.Video}],
    }
    console.debug("RenderingStartRequest", Endpoints.rendering.start, request)
    endpointPromise(Endpoints.rendering.start, request).then((response: RenderingStartResponse) => {
      console.debug("RenderingStartResponse", Endpoints.rendering.start, response)
      const { apiCallback } = response

      setProcessing(false)
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { RenderControl }
