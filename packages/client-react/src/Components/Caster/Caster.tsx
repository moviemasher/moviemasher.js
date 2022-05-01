import React from 'react'
import {
  Endpoints, ServerType,
  Cast, castEditorInstance, castInstance,
  DataCastDefaultRequest, DataCastDefaultResponse
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { ApiContext } from '../../Contexts/ApiContext'
import { CasterContext, CasterContextInterface } from '../../Contexts/CasterContext'
import { View } from '../../Utilities/View'

export interface CasterProps extends PropsWithChildren, WithClassName {
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
export function Caster(props: CasterProps): ReactResult {
  const { cast, ...rest } = props
  const [requested, setRequested] = React.useState(false)
  const [castEditor] = React.useState(() => castEditorInstance({}))
  const apiContext = React.useContext(ApiContext)

  const { enabled, endpointPromise } = apiContext

  React.useEffect(() => {
    if (cast) castEditor.edited = cast
    else if (!requested && enabled.includes(ServerType.Data)) {
      setRequested(true)
      const request: DataCastDefaultRequest = {}
      console.debug("DataCastDefaultRequest", Endpoints.data.cast.default, request)
      endpointPromise(Endpoints.data.cast.default, request).then((response: DataCastDefaultResponse) => {
        console.debug("DataCastDefaultResponse", Endpoints.data.cast.default, response)
        const { cast } = response
        castEditor.edited = castInstance(cast)
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
