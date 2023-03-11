import { 
  assertEndpoint,
  endpointAbsolute, Request, StringRecord, Value
} from "@moviemasher/moviemasher.js"

import { hashMd5 } from './Hash'

export interface RequestArgs {
  auth?: string
  headers?: StringRecord
  hostname?: string
  method?: string
  path?: string
  port?: Value
  protocol?: string
}

export const requestArgs = (request: Request): RequestArgs => {
  const { endpoint, init = {} } = request
  assertEndpoint(endpoint)
  
  const absolute = endpointAbsolute(endpoint)
  const { protocol, hostname, port, pathname, search } = absolute
  const pathComponents: string[] = []
  if (pathname) pathComponents.push(pathname)
  if (search) pathComponents.push(search)
  const path = pathComponents.join('')

  const { method, headers: initHeaders = {} } = init
  const entries = Object.entries(initHeaders)
  const lowerCased = entries.map(([key, value]) => ([key.toLowerCase(), value]))
  const headers = Object.fromEntries(lowerCased)
  const args: RequestArgs = { method, protocol, hostname, port, path, headers }
  return args
}

export const requestArgsHash = (args: RequestArgs): string => (
  hashMd5(JSON.stringify(args))
)

// export const requestHash = (request: Request): string => (
//   requestArgsHash(requestArgs(request))
// )
