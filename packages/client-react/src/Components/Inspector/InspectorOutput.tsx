import React from 'react'
import {
  OutputFactory, EncodeOptionsRequest, EncodeOptionsResponse,
  urlForServerOptions, fetchJson, ServerType
} from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { InspectorProperties, InspectorPropertiesProps } from './InspectorProperties'
import { ApiContext } from '../../Contexts/ApiContext'
import { useEditor } from '../../Hooks/useEditor'
import { ProcessContext } from '../../Contexts/ProcessContext'

interface InspectorOutputProps extends PropsAndChildren, Omit<InspectorPropertiesProps, 'inspected'> {}

function InspectorOutput(props: InspectorOutputProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const apiContext = React.useContext(ApiContext)
  const editor = useEditor()

  const { processing, setProcessing, setStatus } = processContext
  const { enabled, serverOptionsPromise } = apiContext
  const { output, editType } = editor

  React.useEffect(() => {
    if (output) return
    if (!enabled.includes(ServerType.Encode)) return
    if (processing) return

    setProcessing(true)
    serverOptionsPromise(ServerType.Encode, setStatus).then(serverOptions => {
      const url = urlForServerOptions(serverOptions, '/options')
      const request: EncodeOptionsRequest = { type: editType }
      const options = fetchJson(request)
      console.debug("EncodeOptionsRequest", url, request)
      setStatus(`Finding ${editType} output options`)
      fetch(url, options).then(r => r.json()).then((output: EncodeOptionsResponse) => {
        console.debug("EncodeOptionsResponse", url, output)
        setStatus(`Found ${editType} output options`)
        editor.output = OutputFactory.instance(output)
        setProcessing(false)
      })
    })
  }, [enabled])
  if (!output) return null

  const inspectorSelectionProps: InspectorPropertiesProps = {
    inspected: output,
    ...props
  }
  return <InspectorProperties {...inspectorSelectionProps} />
}

export { InspectorOutput, InspectorOutputProps }
