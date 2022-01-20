import React from 'react'
import {
  ServersInit, ApiServerResponse, ApiServerRequest, ServerOptions, urlForServerOptions, idPrefixSet, StringSetter, fetchJson, ApiServersResponse, ServerTypes, ServerType
} from '@moviemasher/moviemasher.js'

import { ApiContext, ApiContextInterface } from '../../Contexts/ApiContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

interface ApiProps extends PropsWithChildren {
  serverOptions?: ServerOptions
 }

type ServersOptions = {
  [index in ServerType]?: ApiServerResponse
}


function Api(props: ApiProps): ReactResult {
  const [options, setOptions] = React.useState<ServersOptions>(() => ({}))
  const [inits, setInits] = React.useState<ApiServersResponse>(() => ({}))
  const [enabled, setEnabled] = React.useState<ServerType[]>(() => ([]))
  const { serverOptions, children } = props
  const server = serverOptions || { prefix: '/api' }

  const serverOptionsPromise = (id: ServerType, setStatus?: StringSetter): Promise<ServerOptions> => {
    const serverOptions = options[id]
    if (serverOptions) return Promise.resolve(serverOptions)

    const url = urlForServerOptions(server, '/server')
    const request: ApiServerRequest = { id }
    const init = fetchJson(request)
    console.debug("ApiServerRequest", url, request)
    if (setStatus) setStatus(`Finding ${id} server`)
    const fetchPromise = fetch(url, init).then(response => response.json())
    return fetchPromise.then((response: ApiServerResponse) => {
      console.debug("ApiServerResponse", url, response)
      if (setStatus) setStatus(`Found ${id} server at ${response.prefix}`)
      setOptions(servers => ({ ...servers, [id]: response }))
      return response
    })
  }
  const url = urlForServerOptions(server, '/servers')
  React.useEffect(() => {
    if (url) {
      console.debug("ApiServersRequest", url)
      const fetchPromise = fetch(url).then(response => response.json())
      fetchPromise.then((response: ApiServersResponse) => {
        console.debug("ApiServersResponse", url, response)

        setInits(response)

        setEnabled(ServerTypes.filter(type => !!response[type]))
        if (response.content?.uuid) idPrefixSet(response.content.uuid)
      })
    } else setEnabled([])
  }, [url])

  const apiContext: ApiContextInterface = { enabled, serverOptionsPromise }

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  )
}

export { Api, ApiProps }
