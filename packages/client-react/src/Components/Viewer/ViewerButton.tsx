import React from "react"
import { urlForServerOptions, ServerType } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult } from "../../declarations"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { ApiContext } from "../../Contexts/ApiContext"
import { useStreamEditor } from "../../Hooks/useStreamEditor"
import { EncodeStreamResponse } from "@moviemasher/moviemasher.js"
import { View } from "../../Utilities/View"

function ViewerButton(props: PropsAndChildren): ReactResult {
  const editor = useStreamEditor()
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)

  // const { children, ...rest } = props
  const { processing, setProcessing, setStatus } = processContext
  const [disabled, setDisabled] = React.useState(processing)
  const { serverOptionsPromise } = apiContext

  const startStreaming = () => {
    const serverPromise = serverOptionsPromise(ServerType.Encode, setStatus)
    serverPromise.then(serverOptions => {
      const url = urlForServerOptions(serverOptions, '/stream')
      console.debug('EncodeStreamRequest', url)
      setStatus(`Starting Stream`)
      fetch(url).then(r => r.json()).then((response: EncodeStreamResponse) => {
        console.debug("EncodeStreamResponse", url, response)
        setStatus(`Started Stream`)
        const { id, readySeconds, streamUrl } = response
        editor.streamUrl = streamUrl
        setTimeout(() => {
          setProcessing(true)
        }, 1000 * readySeconds)

        // const { width, height, fps: rate } = output
        // const size = { width, height }
        // const { stream } = editor
        // setStatus(`Loading segment`)
        // const type = RenderType.Stream

        // const promise = stream.segmentPromise({type, size, rate})
        // promise.then(segment => {

        //   const updateUrl = urlForServerOptions(serverOptions, '/update')
        //   const request: EncodeUpdateRequest = { segment, id }
        //   const fetchOptions = fetchJson(request)
        //   console.debug('EncodeUpdateRequest', streamUrl, request)
        //   setStatus(`Updating stream`)
        //   fetch(updateUrl, fetchOptions).then(r => r.json()).then((response:EncodeUpdateResponse) => {
        //     console.debug("EncodeUpdateResponse", updateUrl, response)
        //     setStatus(`Updated stream`)
        //     // setTimeout(pollProgress, 1000)
        //   })
        // })
      })
    })
  }

  const onClick = () => {
    if (disabled) return

    setDisabled(true)
    startStreaming()
  }

  const viewProps = { ...props, onClick, disabled }
  return <View {...viewProps} />
}

export { ViewerButton }
