import React from "react"
import {
  RenderingStartRequest, RenderingStartResponse,
  Endpoints,
  OutputType,
  fetchCallback,
  ApiCallbackResponse,
  ApiCallback,
  DataMashPutRequest,
  EventType,
  MasherAction
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { useMashEditor } from "../../Hooks/useMashEditor"
import { useListeners } from "../../Hooks/useListeners"

export function RenderControl(props: PropsAndChild): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const { children, ...rest } = props
  const { processing, setProcessing, setError } = processContext
  const { endpointPromise } = apiContext
  const masher = useMashEditor()
  const getDisabled = () => {
    const { mash } = masher
    if (mash.id) return masher.can(MasherAction.Save)

    return true
  }
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Save]: updateDisabled,
    [EventType.Mash]: updateDisabled,
    [EventType.Action]: updateDisabled
  })

  const handleApiCallback = (callback: ApiCallback) => {
    setTimeout(() => {
      // console.debug("handleApiCallback request", callback)
      fetchCallback(callback).then((response: ApiCallbackResponse) => {
      // console.debug("handleApiCallback response", response)
        const { apiCallback, error } = response
        if (error) handleError(callback.endpoint.prefix!, error)
        else if (apiCallback) {
          const { request, endpoint } = apiCallback
          if (endpoint.prefix === Endpoints.data.mash.put) {
            const putRequest: DataMashPutRequest = request!.body!
            const { rendering } = putRequest.mash
            if (rendering) masher.mash.rendering = rendering
          }
          handleApiCallback(apiCallback)
        }
        else setProcessing(false)
      })
    }, 2000)
  }
  const handleError = (endpoint: string, error: string) => {
    setProcessing(false)
    setError(error)
    console.error(endpoint, error)
  }

  const onClick = () => {
    if (disabled || processing) return

    setProcessing(true)
    const request: RenderingStartRequest = {
      mash: masher.mash.toJSON(),
      definitions: masher.definitions.toJSON(),
      outputs: [{outputType: OutputType.Video}],
    }
    // console.debug("RenderingStartRequest", Endpoints.rendering.start, request)
    endpointPromise(Endpoints.rendering.start, request).then((response: RenderingStartResponse) => {
      // console.debug("RenderingStartResponse", Endpoints.rendering.start, response)
      const { apiCallback, error } = response
      if (error) handleError(Endpoints.rendering.start, error)
      else handleApiCallback(apiCallback!)
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: disabled || processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
