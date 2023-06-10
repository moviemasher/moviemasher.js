import { Strings } from '@moviemasher/runtime-shared'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { ColonChar, SlashChar } from '../../Setup/Constants.js'
import { ProtocolBlob } from '../../Plugin/Protocol/Protocol.js'

export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint = '', response } = request
  if (response) return URL.createObjectURL(response)
    
  if (typeof endpoint === 'string') return endpoint

  const { protocol, hostname, port, pathname, search } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)
  if (search) pathBits.push(search)
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!protocol.startsWith(ProtocolBlob)) bits.push(SlashChar, SlashChar)
  bits.push(hostname)
  if (port) bits.push(`${ColonChar}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}
