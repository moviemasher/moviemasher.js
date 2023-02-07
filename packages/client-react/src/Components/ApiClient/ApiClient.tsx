import React from 'react'
import {
  ApiVersion,
  ApiCallbacksResponse,
  Endpoint, EndpointPromiser, fetchJsonPromise, 
  ApiServersRequest, ApiServersResponse, 
  Endpoints, isPopulatedObject, ApiCallbacks, ApiCallback, urlEndpoint, 
  ApiCallbacksRequest,
  urlBaseInitialize,
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from '../../declarations'
import { ApiContext, ApiContextInterface } from './ApiContext'

export interface ApiProps extends PropsWithChildren {
  endpoint?: Endpoint
  path?: string
}

export function ApiClient(props: ApiProps): ReactResult {
  const { endpoint: end, children, path } = props
  urlBaseInitialize()

  const endpoint = end || urlEndpoint({ pathname: path || Endpoints.api.callbacks })

  console.log("ApiClient", path, end, endpoint)
  const [enabled, setEnabled] = React.useState(false)
  const callbacksRef = React.useRef<ApiCallbacks>({[Endpoints.api.callbacks]: { endpoint }})

  const { current: callbacks } = callbacksRef

  const serversRef = React.useRef<ApiServersResponse>({})
  const { current: servers } = serversRef

  const endpointPromise: EndpointPromiser = (id, body) => {
    return serverPromise(id).then(endpointResponse => {
      if (isPopulatedObject(body)) {
        endpointResponse.init ||= {}
        endpointResponse.init.body = { version: ApiVersion, ...body }
      }
      return fetchJsonPromise(endpointResponse)
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
      endpoint, init: { body: request }
    }
    console.debug("ApiCallbacksRequest", endpoint, request)
    return fetchJsonPromise(promiseCallback).then((response: ApiCallbacksResponse) => {
      console.debug("ApiCallbacksResponse", endpoint, response)
      const { apiCallbacks } = response
      Object.assign(callbacks, apiCallbacks)
      return apiCallbacks[id]
    })
  }

  React.useEffect(() => {
    const request: ApiServersRequest = {}
    console.debug("ApiServersRequest", request)
    endpointPromise(Endpoints.api.servers, request).then((response: ApiServersResponse) => {
      console.debug("ApiServersResponse", response)
      Object.assign(servers, response)
      setEnabled(true)
    })
  }, [])

  const apiContext: ApiContextInterface = { enabled, endpointPromise, servers }

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  )
}
