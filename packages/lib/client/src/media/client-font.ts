
import type { ClientFont, ClientFontDataOrError, MediaRequest } from '@moviemasher/runtime-client'

import { EventClientFontPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, error, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'
import { requestUrl } from '../Client/request/request.js'

export const requestFontPromise = (request: MediaRequest): Promise<ClientFontDataOrError> => {
  const { response } = request
  if (response) return Promise.resolve({ data: response as ClientFont })

  const url = requestUrl(request)
  if (!url) return errorPromise(ErrorName.Url)

  const { init } = request
  const family = url.replace(/[^a-z0-9]/gi, '_')

  // console.debug('requestFontPromise', url)
  const bufferPromise: Promise<ClientFontDataOrError> = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log('fontPromise.fetch', type)
    if (!mimetype || mimetype.startsWith('font')) {
      return response.arrayBuffer().then(buffer => {
        // console.log('fontPromise.bufferPromise', url)
        const face = new FontFace(family, buffer)
        return face.load().then(() => ({ data: face }))
      })
    }

    //  mimetype does not match load type, try to load as css
    if (!mimetype.startsWith('text/css'))
      return error(ErrorName.ImportType)

    return response.text().then(cssText => {
      const url = urlFromCss(cssText)
      if (!url)
        return error(ErrorName.Url)

      return requestFontPromise({ endpoint: url })
    })
  })

  return bufferPromise.then(orError => {
    if (isDefiniteError(orError))
      return orError

    const { data } = orError
    const { fonts } = globalThis.document
    fonts.add(data)
    return fonts.ready.then(() => ({ data }))
  })
}

const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  const { length: matchesLength } = matchesArray
  const lastMatches = matchesArray[matchesLength - 1]
  const { length: lastMatchesLength } = lastMatches
  const lastMatch = lastMatches[lastMatchesLength - 1]
  return lastMatch
}

const FontListener = (event: EventClientFontPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestFontPromise(request)
}
MovieMasher.eventDispatcher.addDispatchListener(EventClientFontPromise.Type, FontListener)


