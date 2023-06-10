import { error, errorPromise } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { isDefiniteError } from '../../Shared/SharedGuards.js'
import { EndpointRequest } from '@moviemasher/runtime-shared'
import { ClientFontDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'
import { requestUrl } from '../request/request.js'
import { ClientFontEvent } from '../../Helpers/ClientMedia/ClientMediaEvents.js'
import { MovieMasher } from '@moviemasher/runtime-client'

export const requestFontPromise = (request: EndpointRequest): Promise<ClientFontDataOrError> => {
  const url = requestUrl(request)
  if (!url)
    return errorPromise(ErrorName.Url)

  const { init } = request
  const family = url.replace(/[^a-z0-9]/gi, '_')

  console.debug('requestFontPromise', url)
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

    // @ts-expect-error - fonts is a Set
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

const FontListener = (event: ClientFontEvent) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestFontPromise(request)
}
MovieMasher.eventDispatcher.addDispatchListener('clientfont', FontListener)


