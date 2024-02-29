import type { RetrieveFunction } from '../types.js'

import { ERROR, MOVIE_MASHER, errorCaught, errorPromise } from '../runtime.js'
import { isClientFont, isString } from '../utility/guard.js'
import { requestUrl, urlName } from '../utility/request.js'

export const cssRetrieveFunction: RetrieveFunction = (resource) => {
  const { request } = resource
  const { response, init, resourcePromise } = request
  if (isString(response)) return Promise.resolve({ data: response })

  if (resourcePromise) return resourcePromise

  const url = requestUrl(request)
  if (!url) return errorPromise(ERROR.Url)

  return request.resourcePromise = fetch(url, init).then(response => {
    return response.text().then(cssText => {
      request.response = cssText
      delete request.resourcePromise
      return { data: cssText }
    })
  })
}


export const fontRetrieveFunction: RetrieveFunction = resource => {
  const result = { data: 'OK' }
  const { request } = resource
  const { response, init, resourcePromise } = request
  if (isClientFont(response)) return Promise.resolve(result)
  if (resourcePromise) return resourcePromise

  const url = requestUrl(request)
  if (!url) return errorPromise(ERROR.Url)
  
  return request.resourcePromise = fetch(url, init).then(response => {
    return response.arrayBuffer().then(buffer => {
      const { document, FontFace } = MOVIE_MASHER.window
      const { fonts } = document
      const fontFamily = urlName(url)
      const face = new FontFace(fontFamily, buffer)
      return face.load().then(() => {
        fonts.add(face)
        return fonts.ready.then(() => {
          request.response = face
          delete request.resourcePromise
          return result
        }).catch(error => errorCaught(error))
      })
    })
  })
}
