import React from 'react'
import {
  Endpoints,
  mashEditorInstance, MashFactory, ServerType, UnknownObject,
  DataMashDefaultResponse,
  DataMashDefaultRequest,
  Size
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { MasherContext, MasherContextInterface } from '../../Contexts/MasherContext'
import { ApiContext } from '../../Contexts/ApiContext'
import { View } from '../../Utilities/View'

interface MasherOptions extends UnknownObject, WithClassName {
  previewSize?: Size
}

interface MasherProps extends MasherOptions, PropsWithChildren {
}

/**
 * @parents ApiClient, Caster
 * @children Browser, Timeline, Inspector, Player
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
function Masher(props: MasherProps): ReactResult {
  const { mash, previewSize, ...rest } = props
  const viewRef = React.useRef<HTMLDivElement>(null)
  const apiContext = React.useContext(ApiContext)
  const [requested, setRequested] = React.useState(false)

  const { enabled, endpointPromise, servers } = apiContext
  const [mashEditor] = React.useState(() => mashEditorInstance())
  const setPreviewSize = (size?: Size) => {
    const { current } = viewRef
    if (!(size && current)) return

    const { width, height } = size
    current.style.setProperty('--preview-width', `${width}px`)
    current.style.setProperty('--preview-height', `${height}px`)
  }
  React.useEffect(() => {
    if (!requested) {
      if (!enabled.includes(ServerType.Data)) return

      setRequested(true)
      const request: DataMashDefaultRequest = {}
      // console.debug("DataMashDefaultRequest", Endpoints.data.mash.default, request)
      endpointPromise(Endpoints.data.mash.default, request).then((response: DataMashDefaultResponse) => {
        console.debug("DataMashDefaultResponse", Endpoints.data.mash.default, response)
        const { mash, definitions, previewSize: serverSize } = response
        setPreviewSize(serverSize)
        if (servers.file?.prefix) {
          // console.log("Masher servers.file.prefix", servers.file.prefix)
          mashEditor.preloader.endpoint.prefix = String(servers.file.prefix)
        }
        mashEditor.mash = MashFactory.instance(mash, definitions)
      })
    }
  }, [enabled])

  React.useEffect(() => { setPreviewSize(previewSize) }, [previewSize])

  const context: MasherContextInterface = { mashEditor }
  const viewProps = { ...rest, ref: viewRef }
  return (
    <MasherContext.Provider value={context}>
      <View { ...viewProps } />
    </MasherContext.Provider>
  )
}

export { Masher, MasherProps, MasherOptions }
