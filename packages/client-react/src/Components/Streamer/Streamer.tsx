import React from 'react'
import {
  ServerType,
  Stream, StreamEditorFactory, StreamFactory, UnknownObject,
  urlForServerOptions
} from '@moviemasher/moviemasher.js'

import { EditorContext } from '../../Contexts/EditorContext'
import { ApiContext } from '../../Contexts/ApiContext'
import { View } from '../../Utilities/View'
import { EditorInputs, PropsWithChildren, ReactResult } from '../../declarations'

interface StreamerOptions extends UnknownObject {
  stream?: Stream
  className?: string
  inputs: EditorInputs
}

interface StreamerProps extends StreamerOptions, PropsWithChildren {}

/**
 * @example
 * ```
 * const props: StreamerProps = { children: [] }
 * const editor: JSX.Element = <Streamer { ...props } />
 * ```
 * @parents Api
 * @returns provided children wrapped in a {@link View} and {@link EditorContext}
 */
function Streamer(props: StreamerProps): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const [requested, setRequested] = React.useState(false)

  const { stream, inputs, ...rest } = props
  const { enabled, serverOptionsPromise } = apiContext

  const [editor] = React.useState(() => StreamEditorFactory.instance({ fps: 24 }))

  const context = { editor, inputs }

  React.useEffect(() => {
    if (stream) editor.stream = stream
    else if (!requested && enabled.includes(ServerType.Content)) {
      setRequested(true)
      serverOptionsPromise(ServerType.Content).then(serverOptions => {
        const contentUrl = urlForServerOptions(serverOptions, '/stream')
        console.debug("GET request", contentUrl)
        fetch(contentUrl).then(response => response.json()).then((json) => {
          console.debug("GET response", contentUrl, json)
          editor.stream = StreamFactory.instance(json)
        })
      })
    }
  }, [enabled])

  return (
    <EditorContext.Provider value={context}>
      <View {...rest} />
    </EditorContext.Provider>
  )
}

export { Streamer, StreamerProps, StreamerOptions }
