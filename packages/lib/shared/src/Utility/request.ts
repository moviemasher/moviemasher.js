import type { EndpointRequest, Strings } from '@moviemasher/runtime-shared'

import { isEndpoint } from '../Helpers/Endpoint.js'
import { COLON, SLASH } from '../Setup/Constants.js'

export const ProtocolBlob = 'blob'


export const urlIsBlob = (url: string): boolean => url.startsWith(ProtocolBlob)

export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint = '' } = request
  if (!isEndpoint(endpoint)) return endpoint

  const { protocol, hostname, port, pathname, search } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)
  if (search) pathBits.push(search)
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SLASH, SLASH)
  bits.push(hostname)
  if (port) bits.push(`${COLON}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}
