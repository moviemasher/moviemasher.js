import React from "react"
import { urlForRemoteServer } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../../../declarations"
import { EditorContext } from "../../../Contexts/EditorContext"
import { RemoteContext } from "../../../Contexts/RemoteContext"
import { HostsContext } from "../../../Contexts/HostsContext"

const StreamButton : React.FunctionComponent<OnlyChildProps> = props => {
  const editorContext = React.useContext(EditorContext)
  const remoteContext = React.useContext(RemoteContext)
  const hostsContext = React.useContext(HostsContext)

  const { children, ...rest } = props
  const { processing, setProcessing, setStatus } = remoteContext
  const { remoteServerPromise } = hostsContext
  const { masher } = editorContext

  const onClick = () => {
    if (processing) return

    setProcessing(true)
    setStatus('Fetching stream host')
    remoteServerPromise('stream').then(remoteServer => {
      const urlString = urlForRemoteServer(remoteServer)
      setStatus(`GET ${urlString}`)
      fetch(urlString).then(response => response.json()).then((outputOptions) => {
        console.log("GET response", urlString, outputOptions)
        setStatus(`POST ${urlString}`)
        const postOptions = {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(outputOptions)
        }

        fetch(urlString, postOptions).then(response => response.json()).then(idObject => {
          console.log("POST response", urlString, idObject)

          const { id } = idObject
          const { width, height } = outputOptions
          const streamUrl = `${urlString}/${id}`
          const size = { width, height }

          const { mash, time } = masher
          setStatus(`Loading mash state ${mash.id}`)

          const promise = masher.mash.mashStatePromise(time, size)
          promise.then(mashState => {
            console.log("mashState", mashState)
            setStatus(`Initializing stream ${id}`)
            const fetchOptions = {
              headers: { 'Content-Type': 'application/json' },
              method: 'POST',
              body: JSON.stringify(mashState)
            }
            fetch(streamUrl, fetchOptions).then(response => response.json()).then(json => {
              console.log("fetched", streamUrl, json)

            })
          })
        })
      })
    })

  }

  const buttonOptions = { ...rest, onClick, disabled: processing }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { StreamButton }
