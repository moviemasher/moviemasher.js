import { ScalarRecord } from "../declarations"
import { Endpoint } from "../Helpers/Endpoint/Endpoint"
import { isLoaderType } from "../Load/Loader"
import { arrayLast } from "./Array"
import { assertPopulatedString, isAboveZero, isNumeric, isPopulatedString, isPositive } from "./Is"
import { ErrorName } from "../Helpers/Error/ErrorName"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"

let urlBaseValue = ''


export const urlBase = (): string => {
  if (!urlBaseInitialized()) return errorThrow(ErrorName.Url)

  return urlBaseValue
}

export const urlBaseInitialize = (base?: string): string => {
  if (isPopulatedString(base)) return urlBaseValue = base

  const { document } = globalThis
  return urlBaseValue = document?.baseURI || 'http://localhost/'
}


export const urlBaseInitialized = (): boolean => Boolean(urlBaseValue)


/**
 * 
 * @param endpoint 
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

export const urlIsObject = (url: string) => url.startsWith('object:/')


export const urlIsHttp = (url: string) => url.startsWith('http')
export const urlIsBlob = (url?: string) => Boolean(url?.startsWith('blob'))

export const urlHasProtocol = (url: string) => url.includes(':')


export const urlCombine = (url: string, path: string): string => {
  const urlStripped = url.endsWith('/') ? url.slice(0, -1) : url
  const pathStripped = path.startsWith('/') ? path.slice(1) : path
  return urlStripped + '/' + pathStripped
}

export const urlResolve = (url: string, path?: string): string => {
  if (!path) return url

  const [first, second] = path
  if (first === '/') return path

  if (first !== '.' || second === '/') return urlCombine(url, path)

  const urlStripped = url.endsWith('/') ? url.slice(0, -1) : url
  const urlBits = urlStripped.split('/')
  path.split('/').forEach(component => {
    if (component === '..') urlBits.pop()
    else urlBits.push(component)
  })
  return urlBits.join('/')
}

export const urlFromEndpoint = (endpoint: Endpoint): string => {
  const mergedEndpoint = urlEndpoint(endpoint)
  const { port, pathname, hostname, protocol, search } = mergedEndpoint
  // if (!protocol) return ''

  assertPopulatedString(hostname)
  assertPopulatedString(protocol)
  
  const bits: string[] = []
  bits.push(protocol, '//', hostname)
  if (isNumeric(port)) bits.push(':', String(port))
  const url = bits.join('')
  if (!pathname) return url

  const combined = urlCombine(url, pathname) 
  if (!search) return combined

  return [combined, search].join('')
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
  if (protocol === 'object:' || urlIsHttp(protocol)) return true
  
  return !isLoaderType(protocol.slice(0, -1))
}

export const urlProtocol = (string: string) => {
  const colonIndex = string.indexOf(':')
  if (!isAboveZero(colonIndex)) return ''
  return string.slice(0, colonIndex + 1)
}

export const urlParse = (string: string) => {
  const colonIndex = string.indexOf(':')
  const slashIndex = string.indexOf('/')
  if (!(isPositive(colonIndex) && isPositive(slashIndex))) return []

  const protocol = string.slice(0, colonIndex + 1)
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
    if (protocol === 'object:' || urlIsHttp(protocol)) break

    urls.push(parsed)
    if (urlIsRootProtocol(urlProtocol(path))) break
  }
  return urls
}

export const urlsAbsolute = (string: string, endpoint: Endpoint) => {
  if (!string || urlIsRootProtocol(urlProtocol(string))) return []

  const urls = urlsParsed(string)
  // console.log(`urlsAbsolute urlsParsed('${string})`, urls)
  const lastUrl = arrayLast(urls)
  if (!lastUrl) return urls

  const path = arrayLast(lastUrl)

  // console.log(`urlsAbsolute path`, path)
  if (urlIsObject(path) || urlIsHttp(path)) return urls

  let absolute = urlForEndpoint(endpoint, path)
  
  const { length } = urls
  for (let i = length - 1; i > -1; i--) {
    const url = urls[i]
    const [protocol, options] = url
    url[2] = absolute
    absolute = `${protocol}${options}/${absolute}`
  }
  return urls
}

export const urlOptionsObject = (options?: string): ScalarRecord | undefined => {
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

export const urlOptions = (options?: ScalarRecord) => {
  if (!options) return ''

  return Object.entries(options).map(entry => entry.join('=')).join(';')
} 

export const urlPrependProtocol = (protocol: string, url: string, options?: ScalarRecord): string => {
  const withColon = protocol.endsWith(':') ? protocol : `${protocol}:`
  if (url.startsWith(withColon) && !options) return url

  return `${withColon}${urlOptions(options)}/${url}`
}

export const urlExtension = (extension: string): string => (
  (extension[0] === '.') ? extension.slice(1) : extension
)

export const urlFilename = (name: string, extension: string): string =>(
  `${name}.${urlExtension(extension)}`
)


export const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = [...matches]
  const url = arrayLast(arrayLast(matchesArray))
  // console.log(this.constructor.name, "lastCssUrl", string, url)
  return url
}
