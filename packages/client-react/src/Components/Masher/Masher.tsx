import React from 'react'
import {
  Mash, MashEditorFactory, MashFactory, ServerType, UnknownObject, urlForServerOptions
} from '@moviemasher/moviemasher.js'

import { EditorInputs, PropsWithChildren, ReactResult } from '../../declarations'
import { EditorContext } from '../../Contexts/EditorContext'
import { ApiContext } from '../../Contexts/ApiContext'
import { View } from '../../Utilities/View'

/**
 * TODO: editor option description
 */
interface MasherOptions extends UnknownObject {
  /**
   * Sets the mash associated with the {@link MashEditor} of my {@link EditorContext}.
   */
  mash?: Mash
  className?: string
  inputs?: EditorInputs
}

/**
 * TODO: editor props description
 */
interface MasherProps extends MasherOptions, PropsWithChildren {
}

/**
 * Main application container supporting {@link Player}, {@link Browser},
 * {@link Timeline}, and {@link Inspector} child components.
 * @example
 * ```
 * const props: MasherProps = { children: [] }
 * const editor: JSX.Element = <Masher { ...props } />
 * ```
 * @parents Api
 * @children Browser, Timeline, Inspector, Player
 * @returns provided children wrapped in a {@link View} and {@link EditorContext}
 */
function Masher(props: MasherProps): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const [requested, setRequested] = React.useState(false)

  const { inputs, mash, ...rest } = props
  const { enabled, serverOptionsPromise } = apiContext

  const [editor] = React.useState(() => MashEditorFactory.instance({ fps: 24 }))

  const editorContext = { editor, inputs }
  React.useEffect(() => {
    if (mash) editor.mash = mash
    else if (!requested) {
      if (!enabled.includes(ServerType.Content)) return

      setRequested(true)
      serverOptionsPromise(ServerType.Content).then(serverOptions => {
        const urlString = urlForServerOptions(serverOptions, '/mash')
        console.debug("GET request", urlString)
        fetch(urlString).then(response => response.json()).then((json) => {
          console.debug("GET response", urlString, json)
          editor.mash = MashFactory.instance(json)
        })
      })
    }
  }, [enabled])


  return (
    <EditorContext.Provider value={editorContext}>
      <View {...rest} />
    </EditorContext.Provider>
  )
}

export { Masher, MasherProps, MasherOptions }
