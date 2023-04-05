import type { ScalarRecord } from '../Types/Core.js'

import { arrayLast } from './Array.js'
import { isAboveZero, isNumeric, isPopulatedString } from './Is.js'
import { SemicolonChar } from '../Setup/Constants.js'

export const urlIsObject = (url: string) => url.startsWith('object:/')

export const urlIsHttp = (url: string) => url.startsWith('http')

export const urlHasProtocol = (url: string) => url.includes(':')

export const urlCombine = (url: string, path: string): string => {
  const urlStripped = url.endsWith('/') ? url.slice(0, -1) : url
  const pathStripped = path.startsWith('/') ? path.slice(1) : path
  return urlStripped + '/' + pathStripped
}


export const urlProtocol = (string: string) => {
  const colonIndex = string.indexOf(':')
  if (!isAboveZero(colonIndex)) return ''
  return string.slice(0, colonIndex + 1)
}

export const urlOptionsObject = (options?: string): ScalarRecord | undefined => {
  if (!isPopulatedString(options)) return 
  // console.log('parseOptions', type, options)

  const pairs = options.split(SemicolonChar)
  const entries = pairs.map(pair => {
    const [key, string] = pair.split('=')
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
  return url
}
