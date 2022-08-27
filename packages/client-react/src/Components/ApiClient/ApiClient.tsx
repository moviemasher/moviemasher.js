import React from 'react'
import {
  ApiVersion,
  ApiEndpointResponse,
  Endpoint, EndpointPromiser, fetchCallback, idPrefixSet,
  ApiServersRequest, ApiServersResponse, ServerTypes, ServerType,
  Endpoints, isPopulatedObject, ApiCallbacks, ApiCallback,
} from '@moviemasher/moviemasher.js'

import { ApiContext, ApiContextInterface } from './ApiContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

export interface ApiProps extends PropsWithChildren {
  endpoint?: Endpoint
  path?: string
}

export function ApiClient(props: ApiProps): ReactResult {
  const { endpoint, children, path } = props
  const callback = { endpoint: endpoint || { prefix: path || Endpoints.api.callbacks } }

  const [callbacks, setCallbacks] = React.useState<ApiCallbacks>(() => (
    { [Endpoints.api.callbacks]: callback }
  ))
  const [servers, setServers] = React.useState<ApiServersResponse>(() => ({}))
  const [enabled, setEnabled] = React.useState<ServerType[]>(() => ([]))

  const endpointPromise: EndpointPromiser = (id, body?) => {
    return serverPromise(id).then(endpointResponse => {
      if (isPopulatedObject(body)) {
        endpointResponse.request ||= {}
        endpointResponse.request.body = { version: ApiVersion, ...body }
      }
      return fetchCallback(endpointResponse)
    })
  }

  const serverPromise = (id: string): Promise<ApiCallback> => {
    const previousResponse = callbacks[id]
    if (previousResponse) {
      // TODO: check for expires...
      return Promise.resolve(previousResponse)
    }

    const promiseCallback: ApiCallback = {
      endpoint: callback.endpoint, request: { body: { id, version: ApiVersion } }
    }
    return fetchCallback(promiseCallback).then((response: ApiEndpointResponse) => {
      // console.debug("ApiEndpointResponse", callback.endpoint, response)
      const { apiCallbacks } = response
      setCallbacks(servers => ({ ...servers, ...apiCallbacks }))
      return apiCallbacks[id]
    })
  }

  React.useEffect(() => {
    const request: ApiServersRequest = {}
    endpointPromise(Endpoints.api.servers, request).then((response: ApiServersResponse) => {
      console.debug("ApiServersResponse", response)
      setServers(response)
      setEnabled(ServerTypes.filter(type => !!response[type]))
      if (response.data?.temporaryIdPrefix) idPrefixSet(response.data.temporaryIdPrefix)
    })
  }, [])

  const apiContext: ApiContextInterface = { 
    exists: true, enabled, endpointPromise, servers 
  }

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  )
}
