import React from "react"
import {
  RenderingStartRequest, RenderingStartResponse,
  Endpoints,
  ApiCallbackResponse,
  ApiCallback,
  DataMashPutRequest,
  EventType,
  MasherAction,
  assertMashMedia,
  MashMedia,
  ApiRequest,
  ApiResponse,
  MashAndMediaObject,
  MediaObjects,
  MashMediaObject,
  VideoType
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../ApiClient/ApiContext"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { jsonPromise } from "@moviemasher/client-core"

export function RenderControl(props: PropsAndChild): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const { children, ...rest } = props
  const { processing, setProcessing, setError } = processContext
  const { endpointPromise } = apiContext
  const editor = useEditor()
  const getDisabled = () => !editor.can(MasherAction.Render)

  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Save]: updateDisabled,
    [EventType.Loaded]: updateDisabled,
    [EventType.Action]: updateDisabled
  })

  const handleApiCallback = (callback: ApiCallback, mash: MashMedia) => {
    setTimeout(() => {
      console.debug("handleApiCallback request", callback)
      jsonPromise(callback).then((response: ApiCallbackResponse) => {
      console.debug("handleApiCallback response", response)
        const { apiCallback, error } = response
        if (error) handleError(callback.endpoint.pathname!, callback.init!, response, error.message)
        else if (apiCallback) {
          const { init, endpoint } = apiCallback
          if (endpoint.pathname === Endpoints.data.mash.put) {
            const putRequest: DataMashPutRequest = init!.body!
            const { rendering } = putRequest.mash

            // TODO: added encoding to mash...
            // if (rendering) mash.rendering = rendering
          }
          handleApiCallback(apiCallback, mash)
        }
        else setProcessing(false)
      })
    }, 2000)
  }
  const handleError = (endpoint: string, request: ApiRequest, response: ApiResponse, error: string) => {
    setProcessing(false)
    setError(error)
    console.error(endpoint, request, response, error)
  }

  const onClick = () => {
    if (disabled || processing) return

    const { mashMedia } = editor
    assertMashMedia(mashMedia)


    setProcessing(true)
    const media = editor.definitions.map(object => object.toJSON()) as MediaObjects
    const mashObject = mashMedia.toJSON() as MashMediaObject
    const mash: MashAndMediaObject = { ...mashObject, media }
    const request: RenderingStartRequest = {
      mash,
      output: {outputType: VideoType},
    }
    console.debug("RenderingStartRequest", Endpoints.rendering.start, request)
    endpointPromise(Endpoints.rendering.start, request).then((response: RenderingStartResponse) => {
      console.debug("RenderingStartResponse", Endpoints.rendering.start, response)
      const { apiCallback, error } = response
      if (error) handleError(Endpoints.rendering.start, request, response, error.message)
      else handleApiCallback(apiCallback!, mashMedia)
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: disabled || processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
