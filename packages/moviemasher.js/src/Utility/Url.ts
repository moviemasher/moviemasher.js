import { Endpoint, ScalarObject } from "../declarations"
import { assertLoaderType, isLoaderType } from "../Loader/Loader"
import { arrayLast } from "./Array"
import { assertPopulatedString, isAboveZero, isNumeric, isPopulatedString, isPositive } from "./Is"

export const urlEndpoint = (endpoint: Endpoint = {}): Endpoint => {
  const { baseURI } = globalThis.document
  const url = new URL(baseURI)
  const { 
    protocol: withColon, host: hostWithPort, pathname: prefix, port 
  } = url
  const host = hostWithPort.split(':').shift()
  const protocol = withColon.slice(0, -1)
  const result: Endpoint = { protocol, host, prefix, ...endpoint }
  if (isNumeric(port)) result.port = Number(port)
  // console.log("urlEndpoint", baseURI, "=>", result)
  return result
}

export const urlIsObject = (url: string) => url.startsWith('object:/')
export const urlIsHttp = (url: string) => url.startsWith('http')

export const urlHasProtocol = (url: string) => url.includes(':')

export const urlCombine = (url: string, path: string): string => {
  const urlStripped = url.endsWith('/') ? url.slice(0, -1) : url
  const pathStripped = path.startsWith('/') ? path.slice(1) : path
  return urlStripped + '/' + pathStripped
}

export const urlFromEndpoint = (endpoint: Endpoint): string => {
  const mergedEndpoint = urlEndpoint(endpoint)
  const { port, prefix, host, protocol } = mergedEndpoint
  assertPopulatedString(host)
  assertPopulatedString(protocol)
  
  const bits: string[] = []
  bits.push(protocol, '://', host)
  if (isNumeric(port)) bits.push(':', String(port))
  const url = bits.join('')
  const combined = prefix ? urlCombine(url, prefix) : url
  // console.log("urlFromEndpoint", endpoint, "=>", combined)

  return combined
}

export const urlForEndpoint = (endpoint: Endpoint, suffix: string = ''): string => {
  if (suffix && urlHasProtocol(suffix)) return suffix
  
  const base = urlFromEndpoint(endpoint)
  const slashed = base.endsWith('/') ? base : base + '/'
  if (!urlHasProtocol(slashed)) return slashed + suffix

  const url = new URL(suffix, slashed)
  const { href } = url
  return href
}

export const urlIsRootProtocol = (protocol: string) => {
  return protocol === 'object' || urlIsHttp(protocol) || !isLoaderType(protocol)
}

export const urlProtocol = (string: string) => {
  const colonIndex = string.indexOf(':')
  if (isAboveZero(colonIndex)) return string.slice(0, colonIndex)
  return ''
}

export const urlParse = (string: string) => {
  const colonIndex = string.indexOf(':')
  const slashIndex = string.indexOf('/')
  if (!(isPositive(colonIndex) && isPositive(slashIndex))) return []

  const protocol = string.slice(0, colonIndex)
  const options = string.slice(colonIndex + 1, slashIndex)
  const rest = string.slice(slashIndex + 1)
  return [protocol, options, rest]
}

export const urlsParsed = (string: string) => {
  if (!string) return []

  const urls = [urlParse(string)]
  let lastPath = ''
  while(lastPath = arrayLast(arrayLast(urls))) {
    const parsed = urlParse(lastPath)
    if (!parsed.length) break

    const [protocol, _, path] = parsed
    if (protocol === 'object' || urlIsHttp(protocol)) break

    urls.push(parsed)
    if (urlIsRootProtocol(urlProtocol(path))) break
  }
  return urls
}

export const urlsAbsolute = (string: string, endpoint: Endpoint) => {
  if (!string || urlIsRootProtocol(urlProtocol(string))) return []

  const urls = urlsParsed(string)
  const lastUrl = arrayLast(urls)
  if (!lastUrl) return urls

  const path = arrayLast(lastUrl)


  if (urlIsObject(path) || urlIsHttp(path)) return urls

  let absolute = urlForEndpoint(endpoint, path)
  
  const { length } = urls
  for (let i = length - 1; i > -1; i--) {
    const url = urls[i]
    const [protocol, options] = url
    url[2] = absolute
    absolute = `${protocol}:${options}/${absolute}`
  }
  return urls
}

export const urlOptionsObject = (options?: string): ScalarObject | undefined => {
  if (!isPopulatedString(options)) return 
  // console.log("parseOptions", type, options)

  const pairs = options.split(';')
  const entries = pairs.map(pair => {
    const [key, string] = pair.split('=')
    const value = isNumeric(string) ? Number(string) : string
    return [key, value]
  })
  return Object.fromEntries(entries)
}

export const urlOptions = (options?: ScalarObject) => {
  if (!options) return ''

  return Object.entries(options).map(entry => entry.join('=')).join(';')
} 

export const urlPrependProtocol = (protocol: string, url: string, options?: ScalarObject): string => {
  if (url.startsWith(protocol) && !options) return url

  return `${protocol}:${urlOptions(options)}/${url}`
}