import React from 'react'
import {
  ApiVersion,
  ApiCallbacksResponse,
  Endpoint, EndpointPromiser, fetchCallback, idPrefixSet,
  ApiServersRequest, ApiServersResponse, ServerTypes, ServerType,
  Endpoints, isPopulatedObject, ApiCallbacks, ApiCallback, urlEndpoint, ApiCallbacksRequest,
} from '@moviemasher/moviemasher.js'

import { ApiContext, ApiContextInterface } from './ApiContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

export interface ApiProps extends PropsWithChildren {
  endpoint?: Endpoint
  path?: string
}

export function ApiClient(props: ApiProps): ReactResult {
  const { endpoint: end, children, path } = props
  console.log("ApiClient", end, path)
  const endpoint = end || urlEndpoint({ prefix: path || Endpoints.api.callbacks })

  const [enabled, setEnabled] = React.useState(false)
  const callbacksRef = React.useRef<ApiCallbacks>({[Endpoints.api.callbacks]: { endpoint }})
  // const [callbacks, setCallbacks] = React.useState<ApiCallbacks>(() => (
  //   { [Endpoints.api.callbacks]: { endpoint } }
  // ))
  const { current: callbacks } = callbacksRef

  const serversRef = React.useRef<ApiServersResponse>({})
  const { current: servers } = serversRef
  // const [servers, setServers] = React.useState<ApiServersResponse>(() => ({}))

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

    const request: ApiCallbacksRequest = { id, version: ApiVersion } 
    const promiseCallback: ApiCallback = {
      endpoint, request: { body: request }
    }
    console.debug("ApiCallbacksRequest", endpoint, request)
    return fetchCallback(promiseCallback).then((response: ApiCallbacksResponse) => {
      console.debug("ApiCallbacksResponse", endpoint, response)
      const { apiCallbacks } = response
      Object.assign(callbacks, apiCallbacks)
      // setCallbacks(servers => ({ ...servers, ...apiCallbacks }))
      return apiCallbacks[id]
    })
  }

  React.useEffect(() => {
    const request: ApiServersRequest = {}
    console.debug("ApiServersRequest", request)
    endpointPromise(Endpoints.api.servers, request).then((response: ApiServersResponse) => {
      console.debug("ApiServersResponse", response)
      if (response.data?.temporaryIdPrefix) idPrefixSet(response.data.temporaryIdPrefix)
      Object.assign(servers, response)
      setEnabled(true)
      // setServers(response)
    })
  }, [])

  const apiContext: ApiContextInterface = { 
    enabled, endpointPromise, servers 
  }

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  )
}
