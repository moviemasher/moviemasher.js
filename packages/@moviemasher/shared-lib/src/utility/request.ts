import type { DataOrError, EndpointRequest, StringDataOrError, Strings } from '../types.js'

import { COLON, EQUALS, $GET, QUESTION, SLASH, isDefiniteError } from '../runtime.js'
import { isObject } from './guard.js'
import { isString } from './guard.js'

const $BLOB = 'blob'

const urlIsBlob = (url: string): boolean => url.startsWith($BLOB)

export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint = '', init } = request
  if (isString(endpoint)) return endpoint

  const { protocol, hostname, port, pathname, search } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)

  const searchBits: Strings = []

  if (search) searchBits.push(search.slice(1))
  if (init) {
    const { body, method } = init
    if (method === $GET && isObject(body)) {
      searchBits.push(...Object.entries(body).map(entry => entry.join(EQUALS)))
    }
  }
  if (searchBits.length) pathBits.push(QUESTION, searchBits.join('&'))
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SLASH, SLASH)
  bits.push(hostname)
  if (port) bits.push(`${COLON}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}


export const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  const { length } = matchesArray
  if (!length) return ''

  const values = matchesArray[length - 1]
  const { length: valuesLength } = values
  if (!valuesLength) return ''

  return values[valuesLength - 1]
}

export const familyFromCss = (string: string): string => {
  // regular expression to find the font-family, ignoring  whitespace and quotes
  const exp = /font-family: ['"]?([^'";]*)['";]?/gm
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  const { length } = matchesArray
  if (!length) return ''

  const values = matchesArray[length - 1]
  const { length: valuesLength } = values
  if (!valuesLength) return ''
  
  return values[valuesLength - 1]
}

export const urlName = (url: string): string => url.replace(/[^a-z0-9]/gi, '_')
