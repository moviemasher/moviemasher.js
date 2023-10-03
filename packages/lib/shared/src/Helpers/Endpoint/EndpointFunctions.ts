import type { Endpoint, ScalarRecord } from '@moviemasher/runtime-shared'

import { errorThrow, isNumeric, isObject, isPopulatedString } from '@moviemasher/runtime-shared'
import { DOT, COLON, EQUALS, QUESTION, SEMICOLON, SLASH } from '../../Setup/Constants.js'
import { assertPopulatedString, isAboveZero } from '../../Shared/SharedGuards.js'
import { arrayLast } from '../../Utility/ArrayFunctions.js'

export const ProtocolHttp = 'http'
export const ProtocolHttps = 'https'
export const ProtocolSuffix = [COLON, SLASH, SLASH].join('')
const urlIsBlob = (url?: string) => Boolean(url?.startsWith('blob'))

let _urlBase = ''

const urlBase = (): string => {
  if (_urlBase) return _urlBase
  
  const { document } = globalThis
  if (document) {
    const { baseURI } = document
    return _urlBase = baseURI
  }

  return _urlBase = [
    ProtocolHttp, COLON, SLASH, SLASH, 'localhost', SLASH
  ].join('')
}

export const isEndpoint = (value: any): value is Endpoint => {
  return isObject(value)
}

export function assertEndpoint(value: any, name?: string): asserts value is Endpoint {
  if (!isEndpoint(value)) errorThrow(value, 'Endpoint', name)
}

export const endpointFromAbsolute = (urlString: string): Endpoint => {
  const url = new URL(urlString)
  // console.trace('endpointFromAbsolute', urlString, url)
  const { protocol, hostname, pathname, port, search } = url 
  const result: Endpoint = { protocol, hostname, pathname, search }
  if (isNumeric(port)) result.port = Number(port)
  return result
}
export const endpointFromUrl = (urlString: string): Endpoint => {
  if (urlHasProtocol(urlString)) return endpointFromAbsolute(urlString)
  
  const [pathname, search] = urlString.split(QUESTION)
  const result: Endpoint = { pathname }
  if (search) result.search = `${QUESTION}${search}`
  return result
}
export const endpointIsAbsolute = (endpoint: Endpoint): boolean => {
  const { hostname, protocol } = endpoint
  return urlIsBlob(protocol) || isPopulatedString(hostname)
}

/**
 * 
 * @param endpoint - relative or absolute Endpoint
 * @returns endpoint if absolute, otherwise endpoint relative to base URL
 */
export const endpointAbsolute = (endpoint: Endpoint): Endpoint => {
  if (endpointIsAbsolute(endpoint)) return endpoint

  return urlEndpoint(endpoint)
}

export const urlResolve = (url: string, path?: string): string => {
  if (!path) return url

  const [first, second] = path
  if (first === SLASH) return path

  if (first !== DOT || second === SLASH) return urlCombine(url, path)

  const urlStripped = url.endsWith(SLASH) ? url.slice(0, -1) : url
  const urlBits = urlStripped.split(SLASH)
  path.split(SLASH).forEach(component => {
    if (component === `${DOT}${DOT}`) urlBits.pop()
    else urlBits.push(component)
  })
  return urlBits.join(SLASH)
}

/**
 * 
 * @param endpoint - relative Endpoint
 * @returns endpoint resolved relative to base URL
 */
export const urlEndpoint = (endpoint: Endpoint = {}): Endpoint => {
  const url = new URL(urlBase())
  const { protocol, hostname, port, pathname } = url
  
  const result: Endpoint = { 
    protocol, hostname, pathname: urlResolve(pathname, endpoint.pathname) 
  }
  if (isNumeric(port)) result.port = Number(port)
  return result
}

export const urlIsObject = (url: string) => url.startsWith(`object${ProtocolSuffix}`)

export const urlIsHttp = (url: string) => (
  url.startsWith(`${ProtocolHttp}${ProtocolSuffix}`) 
  || url.startsWith(`${ProtocolHttps}${ProtocolSuffix}`) 
)
export const urlHasProtocol = (url: string) => url.includes(COLON)

export const urlCombine = (url: string, path: string): string => {
  const urlStripped = url.endsWith(SLASH) ? url.slice(0, -1) : url
  const pathStripped = path.startsWith(SLASH) ? path.slice(1) : path
  return urlStripped + SLASH + pathStripped
}

export const urlFromEndpoint = (endpoint: Endpoint): string => {
  const mergedEndpoint = urlEndpoint(endpoint)
  const { port, pathname, hostname, protocol, search } = mergedEndpoint
  // if (!protocol) return ''

  assertPopulatedString(hostname)
  assertPopulatedString(protocol)
  
  const bits: string[] = []
  bits.push(protocol, '//', hostname)
  if (isNumeric(port)) bits.push(COLON, String(port))
  const url = bits.join('')
  if (!pathname) return url

  const combined = urlCombine(url, pathname) 
  if (!search) return combined

  return [combined, search].join('')
}

export const urlForEndpoint = (endpoint: Endpoint, suffix = ''): string => {
  if (suffix && urlHasProtocol(suffix)) return suffix
  
  const base = urlFromEndpoint(endpoint)
  const slashed = (base.endsWith(SLASH) || !suffix) ? base : base + SLASH
  if (!urlHasProtocol(slashed)) return slashed + suffix

  const url = new URL(suffix, slashed)
  const { href } = url
  return href
}

export const urlProtocol = (string: string) => {
  const colonIndex = string.indexOf(COLON)
  if (!isAboveZero(colonIndex)) return ''
  return string.slice(0, colonIndex + 1)
}

export const urlOptionsObject = (options?: string): ScalarRecord | undefined => {
  if (!isPopulatedString(options)) return 
  // console.log('parseOptions', type, options)

  const pairs = options.split(SEMICOLON)
  const entries = pairs.map(pair => {
    const [key, string] = pair.split(EQUALS)
    const value = isNumeric(string) ? Number(string) : string
    return [key, value]
  })
  return Object.fromEntries(entries)
}

export const urlOptions = (options?: ScalarRecord) => {
  if (!options) return ''

  return Object.entries(options).map(entry => entry.join('=')).join(SEMICOLON)
} 

export const urlPrependProtocol = (protocol: string, url: string, options?: ScalarRecord): string => {
  const withColon = protocol.endsWith(COLON) ? protocol : `${protocol}:`
  if (url.startsWith(withColon) && !options) return url

  return `${withColon}${urlOptions(options)}${SLASH}${url}`
}

export const urlExtension = (extension: string): string => (
  (extension[0] === DOT) ? extension.slice(1) : extension
)

export const urlFilename = (name: string, extension: string): string =>(
  `${name}.${urlExtension(extension)}`
)


// MOVED: component

export const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  if (!matchesArray.length) return ''

  const url = arrayLast(arrayLast(matchesArray))
  return url
}


export const endpointUrl = (endpoint: Endpoint): string => {
  const absolute = endpointAbsolute(endpoint)
  const { protocol, hostname, pathname, port, search  } = absolute
  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SLASH + SLASH)
  bits.push(hostname)
  if (isNumeric(port)) bits.push(`${COLON}${port}`)
  if (pathname) bits.push(pathname)
  if (search) bits.push(search)
  return bits.join('')
}