import React from "react"
import {
  MasherAction, EventType, Endpoints, Errors, isMash, isCast, DataPutResponse, JsonObject,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ApiContext } from "../../Contexts/ApiContext"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"

export function SaveControl(props:PropsAndChild): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const processContext = React.useContext(ProcessContext)

  const { processing, setProcessing } = processContext
  const [disabled, setDisabled] = React.useState(true)
  const editor = useEditor()
  const updateDisabled = () => {
    const can = editor.can(MasherAction.Save)
    // console.log("updateDisabled", !can)
    setDisabled(!can)
  }
  useListeners({
    [EventType.Action]: updateDisabled,
    [EventType.Save]: updateDisabled,
  })
  const { children, ...rest } = props
  const { endpointPromise } = apiContext
  const onClick = () => {
    if (processing || disabled) return

    setProcessing(true)
    const { edited, editType } = editor
    if (!edited) throw new Error(Errors.selection)

    editor.dataPutRequest().then(request => {
      console.debug("DataPutRequest", Endpoints.data[editType].put, JSON.parse(JSON.stringify(request)))
      endpointPromise(Endpoints.data[editType].put, request).then((response: DataPutResponse) => {
        console.debug("DataPutResponse", Endpoints.data[editType].put, response)
        const { error, temporaryIdLookup } = response
        if (error) console.error(Endpoints.data[editType].put, error)
        else editor.saved(temporaryIdLookup)
        setProcessing(false)
      })
    })
    
  }
  const buttonOptions = { ...rest, onClick, disabled: processing || disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
