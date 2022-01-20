import React from "react"
import { fetchJson, EncodeOptionsResponse, urlForServerOptions, EncodeOptionsRequest, OutputFactory, ServerType, EncodeStreamRequest, EncodeUpdateRequest, EncodeUpdateResponse, RenderType } from "@moviemasher/moviemasher.js"

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
  const { editType } = editor

  const retrieveOptions = () => {
    serverOptionsPromise(ServerType.Encode, setStatus).then(serverOptions => {
      const url = urlForServerOptions(serverOptions, '/options')
      const request: EncodeOptionsRequest = { type: editType }
      const options = fetchJson(request)
      console.debug("ViewerButton POST request", url, request)
      setStatus(`Finding ${editType} output options`)
      fetch(url, options).then(r => r.json()).then((output: EncodeOptionsResponse) => {
        console.debug("ViewerButton POST response", url, output)
        setStatus(`Found ${editType} output options`)
        editor.output = OutputFactory.instance(output)
        startStreaming()
      })
    })
  }
  // const pollProgress = () => {
  //   const progressUrl = `${urlString}/progress`
  //   fetch(progressUrl).then(response => response.json()).then(json => {
  //     const {progress} = json
  //     setStatus(`Progress stream ${id}`)
  //     //setTimeout(pollProgress, 1000)
  //     console.log("fetched", streamUrl, json)
  //   })
  // }


  const startStreaming = () => {
    const {output} = editor
    if (!output) return retrieveOptions()

    const serverPromise = serverOptionsPromise(ServerType.Encode, setStatus)
    serverPromise.then(serverOptions => {
      const streamUrl = urlForServerOptions(serverOptions, '/stream')
      const request: EncodeStreamRequest = output
      const json = fetchJson(request)
      console.debug('EncodeStreamRequest', streamUrl, request)
      setStatus(`Starting Stream`)
      fetch(streamUrl, json).then(r => r.json()).then((response: EncodeStreamResponse) => {
        console.debug("EncodeStreamResponse", streamUrl, response)
        setStatus(`Started Stream`)
        const { id, readySeconds } = response
        editor.streamUrl = `http://localhost:8570/hls/${id}/index.m3u8`
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
