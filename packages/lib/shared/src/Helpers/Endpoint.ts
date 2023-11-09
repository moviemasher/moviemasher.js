import type { Endpoint } from '@moviemasher/runtime-shared'

import { errorThrow, isObject } from '@moviemasher/runtime-shared'
import { COLON, SLASH } from '../Setup/Constants.js'
import { arrayLast } from '../Utility/ArrayFunctions.js'

export const CACHE_ALL = 'cache_all'
export const CACHE_NONE = 'cache_none'
export const CACHE_SOURCE_TYPE = 'cache_source_type'

export const ProtocolHttp = 'http'
export const ProtocolHttps = 'https'
export const ProtocolSuffix = [COLON, SLASH, SLASH].join('')

export const isEndpoint = (value: any): value is Endpoint => {
  return isObject(value)
}

export function assertEndpoint(value: any, name?: string): asserts value is Endpoint {
  if (!isEndpoint(value)) errorThrow(value, 'Endpoint', name)
}

export const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  if (!matchesArray.length) return ''

  const url = arrayLast(arrayLast(matchesArray))
  return url
}
