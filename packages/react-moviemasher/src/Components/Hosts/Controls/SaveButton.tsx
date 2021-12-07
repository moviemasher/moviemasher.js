import React from "react"
import { MasherAction, urlForRemoteServer, EventType } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../../../declarations"
import { useListeners } from "../../../Hooks/useListeners"
import { HostsContext } from "../../../Contexts/HostsContext"
import { RemoteContext } from "../../../Contexts/RemoteContext"

const SaveButton: React.FunctionComponent<OnlyChildProps> = props => {
  const hostsContext = React.useContext(HostsContext)
  const remoteContext = React.useContext(RemoteContext)

  const { processing, setProcessing } = remoteContext
  const [disabled, setDisabled] = React.useState(true)
  const editorContext = useListeners({
    [EventType.Action]: masher => { setDisabled(!masher.can(MasherAction.Save)) }
  })
  const { children, ...rest } = props
  const { remoteServerPromise } = hostsContext
  const { masher } = editorContext
  const onClick = () => {
    if (processing || disabled) return

    setProcessing(true)
    remoteServerPromise('cms').then(remoteServer => {
      const urlString = urlForRemoteServer(remoteServer, '/mash')
      const fetchOptions = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(masher.mash),
      }
      console.debug("POST request", urlString, JSON.parse(fetchOptions.body))
      fetch(urlString, fetchOptions).then(response => response.json()).then((json) => {
        console.debug("POST response", urlString, json)
        setProcessing(false)
      })
    })
  }
  const buttonOptions = { ...rest, onClick, disabled: processing || disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { SaveButton }
