import { Strings, isPopulatedString } from '@moviemasher/runtime-shared'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { ColonChar, SlashChar } from '../../Setup/Constants.js'
import { ProtocolBlob } from '../../Plugin/Protocol/Protocol.js'
import { isEndpoint } from '../../Helpers/Endpoint/EndpointFunctions.js'

export const urlIsBlob = (url: string): boolean => url.startsWith(ProtocolBlob)

export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint = '', response } = request

  if (response) {
    if (isPopulatedString(endpoint) && urlIsBlob(endpoint)) return endpoint

    // TODO: make sure this is released
    return URL.createObjectURL(response)
  }

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
