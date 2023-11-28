import type { DataOrError, EndpointRequest, StringDataOrError, Strings } from '@moviemasher/runtime-shared'

import { COLON, SLASH, isDefiniteError, isString } from '@moviemasher/runtime-shared'

const ProtocolBlob = 'blob'

const urlIsBlob = (url: string): boolean => url.startsWith(ProtocolBlob)

export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint = '' } = request
  if (isString(endpoint)) return endpoint

  const { protocol, hostname, port, pathname, search } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)
  if (search) pathBits.push(search)
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SLASH, SLASH)
  bits.push(hostname)
  if (port) bits.push(`${COLON}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}

export const promiseNumbers = (promises: Promise<DataOrError<number>>[]) => {
  const { length } = promises
  const result = { data: 0 }

  switch (length) {
    case 0: return Promise.resolve(result)
    case 1: return promises[0]
  }

  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    result.data += orError.data
    return next
  }), Promise.resolve(result))

  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    return result
  })
}

export const promisesString = (promises: Promise<StringDataOrError>[]): Promise<StringDataOrError> => {
  const result = { data: '' }

  const { length } = promises
  switch (length) {
    case 0: return Promise.resolve(result)
    case 1: return promises[0]
  }

  const promise = promises.reduce((promise, next) => promise.then(orError => {
    if (isDefiniteError(orError)) return orError
    result.data += orError.data

    return next
  }), Promise.resolve(result))
  return promise.then(orError => {
    if (isDefiniteError(orError)) return orError

    return result
  })
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
