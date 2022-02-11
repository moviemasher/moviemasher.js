import React from "react"
import {
  MasherAction, EventType, Endpoints, DataMashPutRequest, DataMashPutResponse
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { ApiContext } from "../../../Contexts/ApiContext"
import { ProcessContext } from "../../../Contexts/ProcessContext"
import { useMashEditor } from "../../../Hooks/useMashEditor"
import { useListeners } from "../../../Hooks/useListeners"

function SaveControl(props:PropsAndChild): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const processContext = React.useContext(ProcessContext)

  const { processing, setProcessing } = processContext
  const [disabled, setDisabled] = React.useState(true)
  const masher = useMashEditor()
  useListeners({
    [EventType.Action]: () => { setDisabled(!masher.can(MasherAction.Save)) }
  })
  const { children, ...rest } = props
  const { endpointPromise } = apiContext
  const onClick = () => {
    if (processing || disabled) return

    setProcessing(true)
    const { mash } = masher
    const request: DataMashPutRequest = {
      mash: mash.toJSON(),
      definitionIds: mash.definitions.map(definition => definition.id)
    }
    console.debug("DataMashPutRequest", Endpoints.data.mash.put, request)
    endpointPromise(Endpoints.data.mash.put, request).then((response: DataMashPutResponse) => {
      console.debug("DataMashPutResponse", Endpoints.data.mash.put, response)
      setProcessing(false)
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing || disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { SaveControl }
