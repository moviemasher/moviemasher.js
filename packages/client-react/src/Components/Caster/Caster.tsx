import React from 'react'
import {
  Endpoints, ServerType,
  Cast, castEditorInstance, CastFactory,
  DataCastDefaultRequest, DataCastDefaultResponse
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { ApiContext } from '../../Contexts/ApiContext'
import { CasterContext, CasterContextInterface } from '../../Contexts/CasterContext'
import { View } from '../../Utilities/View'

interface CasterProps extends PropsWithChildren, WithClassName {
  cast?: Cast
}

/**
 * @example
 * ```
 * const props: CasterProps = { children: [] }
 * const editor: JSX.Element = <Caster { ...props } />
 * ```
 * @parents ApiClient
 * @returns provided children wrapped in a {@link View} and {@link CasterContext}
 */
function Caster(props: CasterProps): ReactResult {
  const { cast, ...rest } = props
  const [requested, setRequested] = React.useState(false)
  const [castEditor] = React.useState(() => castEditorInstance({}))
  const apiContext = React.useContext(ApiContext)

  const { enabled, endpointPromise } = apiContext

  React.useEffect(() => {
    if (cast) castEditor.cast = cast
    else if (!requested && enabled.includes(ServerType.Data)) {
      setRequested(true)
      const request: DataCastDefaultRequest = {}
      // console.debug("DataCastDefaultRequest", Endpoints.streaming.start, request)
      endpointPromise(Endpoints.streaming.start, request).then((response: DataCastDefaultResponse) => {
        // console.debug("DataCastDefaultResponse", Endpoints.streaming.start, response)
        const { cast } = response
        castEditor.cast = CastFactory.instance(cast)
      })
    }
  }, [enabled])

  const context: CasterContextInterface = { castEditor }
  return (
    <CasterContext.Provider value={context}>
      <View {...rest} />
    </CasterContext.Provider>
  )
}

export { Caster, CasterProps }
