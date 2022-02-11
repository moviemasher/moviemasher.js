import React from 'react'
import {
  Endpoints,
  Mash, MashEditorFactory, MashFactory, ServerType, UnknownObject,
  DataMashDefaultResponse,
  DataMashDefaultRequest
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { MasherContext, MasherContextInterface } from '../../Contexts/MasherContext'
import { ApiContext } from '../../Contexts/ApiContext'
import { View } from '../../Utilities/View'

interface MasherOptions extends UnknownObject, WithClassName {
  mash?: Mash
}

interface MasherProps extends MasherOptions, PropsWithChildren {
}

/**
 * @parents Api, Caster
 * @children Browser, Timeline, Inspector, Player
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
function Masher(props: MasherProps): ReactResult {
  const { mash, ...rest } = props
  const apiContext = React.useContext(ApiContext)
  const [requested, setRequested] = React.useState(false)

  const { enabled, endpointPromise } = apiContext
  const [mashEditor] = React.useState(() => MashEditorFactory.instance({ fps: 24 }))

  React.useEffect(() => {
    if (mash) mashEditor.mash = mash
    else if (!requested) {
      if (!enabled.includes(ServerType.Data)) return

      setRequested(true)
      const request: DataMashDefaultRequest = {}
      console.debug("DataMashDefaultRequest", Endpoints.data.mash.default, request)
      endpointPromise(Endpoints.data.mash.default).then((response: DataMashDefaultResponse) => {
        console.debug("DataMashDefaultResponse", Endpoints.data.mash.default, response)
        const { mash, definitions } = response
        mashEditor.mash = MashFactory.instance(mash, definitions)
      })
    }
  }, [enabled])

  const context: MasherContextInterface = { mashEditor }
  return (
    <MasherContext.Provider value={context}>
      <View { ...rest } />
    </MasherContext.Provider>
  )
}

export { Masher, MasherProps, MasherOptions }
