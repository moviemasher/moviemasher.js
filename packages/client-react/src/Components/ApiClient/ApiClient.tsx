import React from 'react'
import {
  ApiVersion,
  ApiEndpointResponse,
  Endpoint, EndpointPromiser, fetchCallback, idPrefixSet,
  ApiServersRequest, ApiServersResponse, ServerTypes, ServerType,
  Endpoints, isPopulatedObject, ApiCallbacks, ApiCallback, urlEndpoint, ApiEndpointRequest,
} from '@moviemasher/moviemasher.js'

import { ApiContext, ApiContextInterface } from './ApiContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

export interface ApiProps extends PropsWithChildren {
  endpoint?: Endpoint
  path?: string
}

export function ApiClient(props: ApiProps): ReactResult {
  const { endpoint: end, children, path } = props
  const endpoint = end || urlEndpoint({ prefix: path || Endpoints.api.callbacks })

  const [callbacks, setCallbacks] = React.useState<ApiCallbacks>(() => (
    { [Endpoints.api.callbacks]: { endpoint } }
  ))
  const [servers, setServers] = React.useState<ApiServersResponse>(() => ({}))

  const endpointPromise: EndpointPromiser = (id, body?) => {
    return serverPromise(id).then(endpointResponse => {

      // console.debug("ApiClient.endpointPromise.serverPromise", id, endpointResponse)

      if (isPopulatedObject(body)) {
        endpointResponse.request ||= {}
        endpointResponse.request.body = { version: ApiVersion, ...body }
      }
      return fetchCallback(endpointResponse)
    })
  }

  const serverPromise = (id: string): Promise<ApiCallback> => {
    // console.debug("ApiClient.serverPromise", id, endpoint)
    const previousResponse = callbacks[id]
    if (previousResponse) {
      // TODO: check for expires...
      return Promise.resolve(previousResponse)
    }

    const request: ApiEndpointRequest = { id, version: ApiVersion } 
    const promiseCallback: ApiCallback = {
      endpoint, request: { body: request }
    }
    // console.debug("ApiEndpointRequest", endpoint, request)
    return fetchCallback(promiseCallback).then((response: ApiEndpointResponse) => {
      // console.debug("ApiEndpointResponse", endpoint, response)
      const { apiCallbacks } = response
      setCallbacks(servers => ({ ...servers, ...apiCallbacks }))
      return apiCallbacks[id]
    })
  }

  React.useEffect(() => {
    const request: ApiServersRequest = {}
    // console.debug("ApiServersRequest", request)
    endpointPromise(Endpoints.api.servers, request).then((response: ApiServersResponse) => {
      // console.debug("ApiServersResponse", response)
      if (response.data?.temporaryIdPrefix) idPrefixSet(response.data.temporaryIdPrefix)
      setServers(response)
    })
  }, [])

  const apiContext: ApiContextInterface = { 
    enabled: true, endpointPromise, servers 
  }

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  )
}
