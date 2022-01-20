import React from "react"
import {
  fetchJson, MasherAction, urlForServerOptions, EventType, ServerType
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { useListeners } from "../../../Hooks/useListeners"
import { ApiContext } from "../../../Contexts/ApiContext"
import { ProcessContext } from "../../../Contexts/ProcessContext"
import { useMashEditor } from "../../../Hooks/useMashEditor"

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
  const { serverOptionsPromise } = apiContext
  const onClick = () => {
    if (processing || disabled) return

    setProcessing(true)
    serverOptionsPromise(ServerType.Content).then(serverOptions => {
      const urlString = urlForServerOptions(serverOptions, '/mash')
      const fetchOptions = fetchJson(masher.mash)
      console.debug("POST request", urlString)
      fetch(urlString, fetchOptions).then(response => response.json()).then((json) => {
        console.debug("POST response", urlString, json)
        setProcessing(false)
      })
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing || disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { SaveControl }
