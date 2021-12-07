import React from "react"
import { urlForRemoteServer } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../../../declarations"
import { RemoteContext } from "../../../Contexts/RemoteContext"
import { EditorContext } from "../../../Contexts/EditorContext"
import { HostsContext } from "../../../Contexts/HostsContext"

const RenderButton : React.FunctionComponent<OnlyChildProps> = props => {
  const remoteContext = React.useContext(RemoteContext)
  const editorContext = React.useContext(EditorContext)
  const hostsContext = React.useContext(HostsContext)

  const { children, ...rest } = props
  const { processing, setProcessing } = remoteContext
  const { remoteServerPromise } = hostsContext
  const { masher } = editorContext

  const onClick = () => {
    if (processing) return

    setProcessing(true)
    remoteServerPromise('cms').then(remoteServer => {
      const urlString = urlForRemoteServer(remoteServer)
      const job = { input: { type: 'mash', mash: masher.mash } }
      const fetchOptions = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(job)
      }
      console.debug("POST request", urlString, JSON.parse(fetchOptions.body))
      fetch(urlString, fetchOptions).then(response => response.json()).then(json => {
        console.debug("POST response", urlString, json)
        setProcessing(false)
      })
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { RenderButton }
