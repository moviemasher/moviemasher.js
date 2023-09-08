
import type { ClientFont, ClientFontDataOrError, ClientMediaRequest } from '@moviemasher/runtime-client'

import { EventClientFontPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, error, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'
import { CssMimetype, requestUrl, urlFromCss } from '@moviemasher/lib-shared'

export const requestFontPromise = (request: ClientMediaRequest): Promise<ClientFontDataOrError> => {
  const { response } = request
  if (response) return Promise.resolve({ data: response as ClientFont })

  const url = request.objectUrl || requestUrl(request)
  if (!url) return errorPromise(ERROR.Url)

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
    if (!mimetype.startsWith(CssMimetype))
      return error(ERROR.ImportType)

    return response.text().then(cssText => {
      const url = urlFromCss(cssText)
      if (!url)
        return error(ERROR.Url)

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


const FontListener = (event: EventClientFontPromise) => {
  const { detail } = event
  const { request } = detail
  detail.promise = requestFontPromise(request)
}
MovieMasher.eventDispatcher.addDispatchListener(EventClientFontPromise.Type, FontListener)


