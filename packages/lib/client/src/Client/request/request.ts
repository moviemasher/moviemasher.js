import type { MediaRequest } from '@moviemasher/runtime-client'
import type { Strings } from '@moviemasher/runtime-shared'

import { ColonChar, ProtocolBlob, SlashChar, isEndpoint } from '@moviemasher/lib-shared'

export const urlIsBlob = (url: string): boolean => url.startsWith(ProtocolBlob)

export const requestUrl = (request: MediaRequest): string => {
  const { endpoint = '', objectUrl } = request
  if (objectUrl) return objectUrl

  // if (isPopulatedString(endpoint)) return endpoint
  // if (isClientVideo(response)) {
  //   return request.objectUrl = URL.createObjectURL(response)
  //   if (isPopulatedString(endpoint) && urlIsBlob(endpoint)) return endpoint
  //   throw `requestUrl: endpoint is not blob url ${JSON.stringify(endpoint)}`
  //   // TODO: make sure this is released
  //   // return URL.createObjectURL(response)
  // }

  if (!isEndpoint(endpoint)) return endpoint

  const { protocol, hostname, port, pathname, search } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)
  if (search) pathBits.push(search)
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SlashChar, SlashChar)
  bits.push(hostname)
  if (port) bits.push(`${ColonChar}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}
