import type { EndpointRequest, StringRecord, Value } from '@moviemasher/runtime-shared'

import { ProtocolHttp, assertEndpoint, endpointAbsolute, } from '@moviemasher/lib-shared'
import path from 'path'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { hashMd5 } from './Hash.js'

export interface RequestArgs {
  auth?: string
  headers?: StringRecord
  hostname?: string
  method?: string
  path?: string
  port?: Value
  protocol?: string
}

export const requestArgs = (request: EndpointRequest): RequestArgs => {
  const { endpoint, init = {} } = request

  assertEndpoint(endpoint)
  
  const absolute = endpointAbsolute(endpoint)
  const { protocol = ProtocolHttp, hostname, port, pathname, search } = absolute
  const pathComponents: string[] = []
  if (pathname) pathComponents.push(pathname)
  if (search) pathComponents.push(search)
  const path = pathComponents.join('')

  const { method, headers: initHeaders = {} } = init
  const entries = Object.entries(initHeaders)
  const lowerCased = entries.map(([key, value]) => ([key.toLowerCase(), value]))
  const headers = Object.fromEntries(lowerCased)
  const args: RequestArgs = { protocol, hostname }
  if (path) args.path = path

  if (method) args.method = method
  if (port) args.port = port
  if (entries.length) args.headers = headers
  return args
}

export const requestArgsHash = (args: any): string => (
  hashMd5(JSON.stringify(args))
)

export const pathResolvedToPrefix = (url: string, prefix?: string): string => (
  path.resolve(prefix || ENVIRONMENT.get(ENV.ApiDirFilePrefix), url)
)
