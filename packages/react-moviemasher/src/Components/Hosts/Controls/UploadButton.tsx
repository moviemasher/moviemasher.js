import React from "react"
import { urlForRemoteServer } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../../../declarations"
import { HostsContext } from "../../../Contexts/HostsContext"
import { RemoteContext } from "../../../Contexts/RemoteContext"

const UploadButton: React.FunctionComponent<OnlyChildProps> = props => {
  const hostsContext = React.useContext(HostsContext)
  const remoteContext = React.useContext(RemoteContext)

  const { children, ...rest } = props
  const { processing, setProcessing } = remoteContext
  const { remoteServerPromise } = hostsContext

  const onClick = () => {
    if (processing) return

    setProcessing(true)
    remoteServerPromise('cms').then(remoteServer => {
      const urlString = urlForRemoteServer(remoteServer, '/store')
      const decodeJob = {}
      const fetchOptions = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(decodeJob),
      }
      console.log("POST request", urlString, JSON.parse(fetchOptions.body))
      fetch(urlString, fetchOptions).then(response => response.json()).then((json) => {
        console.log("POST response", urlString, json)
        setProcessing(false)
      })
    })
  }

  const buttonOptions = { ...rest, onClick, disabled: processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { UploadButton }
