import React from "react"
import { fetchJson, ServerType, urlForServerOptions } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { ProcessContext } from "../../../Contexts/ProcessContext"
import { ApiContext } from "../../../Contexts/ApiContext"
import { useMashEditor } from "../../../Hooks/useMashEditor"


function RenderControl(props: PropsAndChild): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)

  const { children, ...rest } = props
  const { processing, setProcessing } = processContext
  const { serverOptionsPromise } = apiContext
  const masher = useMashEditor()

  const onClick = () => {
    if (processing) return

    setProcessing(true)
    serverOptionsPromise(ServerType.Encode).then(serverOptions => {
      const urlString = urlForServerOptions(serverOptions)
      const job = { input: { type: 'mash', mash: masher.mash } }
      const fetchOptions = fetchJson(job)
      console.debug("POST request", urlString)
      fetch(urlString, fetchOptions).then(response => response.json()).then(json => {
        console.debug("POST response", urlString, json)
        setProcessing(false)
      })
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { RenderControl }
