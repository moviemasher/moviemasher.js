import type { ScalarRecord } from '../../Types/Core.js'
import type { Endpoint } from './Endpoint.js'

import { Runtime } from '../../Runtime/Runtime.js'
import { 
  assertPopulatedString, isObject, isAboveZero, isNumeric, isPopulatedString 
} from '../../Utility/Is.js'
import { arrayLast } from '../../Utility/Array.js'
import { ColonChar, DotChar, EqualsChar, QuestionChar, SemicolonChar, SlashChar } from '../../Setup/Constants.js'

import { errorThrow } from '../Error/ErrorFunctions.js'
import { ProtocolHttp } from '../../Plugin/Protocol/Protocol.js'
import { EnvironmentKeyUrlBase } from '../../Runtime/Environment/Environment.js'

const urlIsBlob = (url?: string) => Boolean(url?.startsWith('blob'))

const urlBase = (): string => {
  const { environment } = Runtime
  const environmentBase = environment.get(EnvironmentKeyUrlBase)
  if (environmentBase) return environmentBase
  
  const { document } = globalThis
  if (document) {
    const { baseURI } = document
    environment.set(EnvironmentKeyUrlBase, baseURI)
    return baseURI
  }

  const base = [
    ProtocolHttp, ColonChar, SlashChar, SlashChar, 'localhost', SlashChar
  ].join('')
  environment.set(EnvironmentKeyUrlBase, base)
  return base
}

export const isEndpoint = (value: any): value is Endpoint => {
  return isObject(value)
}

export function assertEndpoint(value: any, name?: string): asserts value is Endpoint {
  if (!isEndpoint(value)) errorThrow(value, 'Endpoint', name)
}

export const endpointUrl = (endpoint: Endpoint): string => {
  const absolute = endpointAbsolute(endpoint)
  const { protocol, hostname, pathname, port, search  } = absolute
  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SlashChar + SlashChar)
  bits.push(hostname)
  if (isNumeric(port)) bits.push(`${ColonChar}${port}`)
  if (pathname) bits.push(pathname)
  if (search) bits.push(search)
  return bits.join('')
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
  
  const [pathname, search] = urlString.split(QuestionChar)
  const result: Endpoint = { pathname }
  if (search) result.search = `${QuestionChar}${search}`
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
  if (first === SlashChar) return path

  if (first !== DotChar || second === SlashChar) return urlCombine(url, path)

  const urlStripped = url.endsWith(SlashChar) ? url.slice(0, -1) : url
  const urlBits = urlStripped.split(SlashChar)
  path.split(SlashChar).forEach(component => {
    if (component === `${DotChar}${DotChar}`) urlBits.pop()
    else urlBits.push(component)
  })
  return urlBits.join(SlashChar)
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

export const urlIsObject = (url: string) => url.startsWith(`object${ColonChar}${SlashChar}`)

export const urlIsHttp = (url: string) => url.startsWith(ProtocolHttp)

export const urlHasProtocol = (url: string) => url.includes(ColonChar)

export const urlCombine = (url: string, path: string): string => {
  const urlStripped = url.endsWith(SlashChar) ? url.slice(0, -1) : url
  const pathStripped = path.startsWith(SlashChar) ? path.slice(1) : path
  return urlStripped + SlashChar + pathStripped
}

export const urlFromEndpoint = (endpoint: Endpoint): string => {
  const mergedEndpoint = urlEndpoint(endpoint)
  const { port, pathname, hostname, protocol, search } = mergedEndpoint
  // if (!protocol) return ''

  assertPopulatedString(hostname)
  assertPopulatedString(protocol)
  
  const bits: string[] = []
  bits.push(protocol, '//', hostname)
  if (isNumeric(port)) bits.push(ColonChar, String(port))
  const url = bits.join('')
  if (!pathname) return url

  const combined = urlCombine(url, pathname) 
  if (!search) return combined

  return [combined, search].join('')
}

export const urlForEndpoint = (endpoint: Endpoint, suffix = ''): string => {
  if (suffix && urlHasProtocol(suffix)) return suffix
  
  const base = urlFromEndpoint(endpoint)
  // const slashed = base.endsWith(SlashChar) ? base : base + SlashChar
  if (!urlHasProtocol(base)) return base + suffix

  const url = new URL(suffix, base)
  const { href } = url
  return href
}

export const urlProtocol = (string: string) => {
  const colonIndex = string.indexOf(ColonChar)
  if (!isAboveZero(colonIndex)) return ''
  return string.slice(0, colonIndex + 1)
}

export const urlOptionsObject = (options?: string): ScalarRecord | undefined => {
  if (!isPopulatedString(options)) return 
  // console.log('parseOptions', type, options)

  const pairs = options.split(SemicolonChar)
  const entries = pairs.map(pair => {
    const [key, string] = pair.split(EqualsChar)
    const value = isNumeric(string) ? Number(string) : string
    return [key, value]
  })
  return Object.fromEntries(entries)
}

export const urlOptions = (options?: ScalarRecord) => {
  if (!options) return ''

  return Object.entries(options).map(entry => entry.join('=')).join(SemicolonChar)
} 

export const urlPrependProtocol = (protocol: string, url: string, options?: ScalarRecord): string => {
  const withColon = protocol.endsWith(ColonChar) ? protocol : `${protocol}:`
  if (url.startsWith(withColon) && !options) return url

  return `${withColon}${urlOptions(options)}${SlashChar}${url}`
}

export const urlExtension = (extension: string): string => (
  (extension[0] === DotChar) ? extension.slice(1) : extension
)

export const urlFilename = (name: string, extension: string): string =>(
  `${name}.${urlExtension(extension)}`
)

export const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = [...matches]
  const url = arrayLast(arrayLast(matchesArray))
  return url
}
