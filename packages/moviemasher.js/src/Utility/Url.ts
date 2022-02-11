import { Endpoint } from "../declarations"

const urlEndpoint = (): Endpoint => {
  const url = new URL(document.baseURI)
  const { protocol, host, pathname, port } = url
  const endpoint: Endpoint = { protocol, host, prefix: pathname }
  if (port) endpoint.port = Number(port)
  return endpoint
}

const urlAbsolute = (url: string, base?: string): string => {
  return (new URL(url, base || document.baseURI)).href
}

const urlForEndpoint = (endpoint?: Endpoint, suffix? : string):string => {
  const bits: string[] = []
  if (endpoint) {
    const { host, port, protocol, prefix } = endpoint
    const definedProtocol = protocol || (host ? 'http' : '')
    if (definedProtocol) bits.push(`${definedProtocol}://`)

    if (host) {
      bits.push(host)
      if (port) {
        bits.push(':')
        bits.push(String(port))
      }
    }
    if (prefix) bits.push(prefix)
  }
  if (suffix) bits.push(suffix)
  return urlAbsolute(bits.join(''))
}

/**
 * @category Utility
 */
const Url = {
  absolute: urlAbsolute,
  forEndpoint: urlForEndpoint,
  endpoint: urlEndpoint
}

export { Url, urlAbsolute, urlForEndpoint, urlEndpoint }
