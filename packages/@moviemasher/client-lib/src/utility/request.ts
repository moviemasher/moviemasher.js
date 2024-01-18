import type { Endpoint, EndpointRequest, JsonRecordDataOrError } from '@moviemasher/shared-lib/types.js'
import type { ServerProgress } from '../types.js'

import { assertPopulatedString, assertTrue, isEndpoint, isRequest } from '@moviemasher/shared-lib/utility/guards.js'
import { HTTP, COLON, CONTENT_TYPE, GET, LIST, MIME_JSON, MIME_MULTI, POST, PUT, QUESTION, SLASH, errorCaught, errorPromise, isDefiniteError, isNumeric, isUndefined, jsonStringify, errorThrow } from '@moviemasher/shared-lib/runtime.js'



const delayPromise = (seconds: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

const endpointFromUrl = (url: string): Endpoint => {
  const endpoint: Endpoint = {}
  if (urlHasProtocol(url)) {
    const { protocol, hostname, pathname, port, search } =  new URL(url)
    endpoint.protocol = protocol
    endpoint.hostname = hostname
    endpoint.pathname = pathname
    endpoint.search = search
    if (isNumeric(port)) endpoint.port = Number(port)
  } else {
    const [pathname, search] = url.split(QUESTION)
    endpoint.pathname = pathname
    if (search) endpoint.search = `${QUESTION}${search}`
  }
  return endpoint
}

let _urlBase = ''

const urlBase = (): string => {
  if (_urlBase) return _urlBase
  
  const { document } = globalThis
  if (document) return _urlBase = document.baseURI
  
  return _urlBase = [
    HTTP, COLON, SLASH, SLASH, 'localhost', SLASH
  ].join('')
}

const pathJoin = (url: string, path: string): string => {
  const urlStripped = url.endsWith(SLASH) ? url.slice(0, -1) : url
  const pathStripped = path.startsWith(SLASH) ? path.slice(1) : path
  return [urlStripped, SLASH, pathStripped].join('')
}

const requestFormData = (values: any = {}): FormData => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (isUndefined(value)) return

    if (value instanceof Blob || value instanceof File) {
      // console.log('requestFormData FILE', key, value.name)
      formData.set(key, value)
    }
    else formData.set(key, String(value))
  })
  return formData
}

const requestSearch = (values: any = {}): string => {
  return `?${new URLSearchParams(values)}`
}

const urlHasProtocol = (url: string) => url.includes(COLON)

const urlResolve = (baseUrl: string, path?: string): string => {
  if (!path) return baseUrl

  try { return new URL(path, baseUrl).href }
  catch (error) { errorThrow(error) }
}

const endpointAbsolute = (endpoint: Endpoint = {}): Endpoint => {
  const { hostname, pathname, search = ''} = endpoint
  if (hostname) return endpoint

  return endpointFromUrl(urlResolve(urlBase(), [pathname, search].join('')))
}

const requestUrlInit = (endpointRequest: EndpointRequest, params?: any): [string, RequestInit] => {
  const request = { ...endpointRequest }

  const { endpoint } = request
   // make sure endpoint is a copied object
  const object = isEndpoint(endpoint) ? { ...endpoint } : endpointFromUrl(endpoint)

  // make sure init is a copied object
  const { init: requestInit } = request
  const init = requestInit ? { ...requestInit } : {}

  // make sure init.method is a valid string
  const { method = POST } = init
  assertTrue([GET, POST, PUT, LIST].includes(method))

  init.method ||= method

  if (params) {
    if (method === GET) {
      // populate search with params
      if (isUndefined(object.search)) object.search = requestSearch(params)
    } else if (isUndefined(init.body)) {
      // make sure we have headers with content type
      init.headers ||= {}
      const { [CONTENT_TYPE]: contentType = MIME_JSON } = init.headers

      // populate body with params as json string or FormData
      switch (contentType) {
        case MIME_JSON:
          init.headers[CONTENT_TYPE] ||= contentType
          init.body = jsonStringify(params)
          break
        case MIME_MULTI:
          // not sure why this needs to be deleted?
          delete init.headers[CONTENT_TYPE]
          init.body = requestFormData(params)
          break
      }
    }
  }
  return [endpointUrl(object), init]
}

export const endpointUrl = (endpoint: Endpoint): string => {
  const absoluteEndpoint = endpointAbsolute(endpoint)
  const { port, pathname, hostname, protocol, search } = absoluteEndpoint

  assertPopulatedString(hostname)
  assertPopulatedString(protocol)
  
  const bits = [protocol, SLASH, SLASH, hostname]
  if (isNumeric(port)) bits.push(COLON, String(port))
  const url = bits.join('')
  if (!pathname) return url

  const combined = pathJoin(url, pathname) 
  if (!search) return combined

  const joined = [combined, search].join('')
  return joined
}

export const requestCallbackPromise = async (request: EndpointRequest, progress?: ServerProgress, params?: any): Promise<JsonRecordDataOrError> => {
  progress?.do(1)
  
  await delayPromise(1)
  // console.debug('requestCallbackPromise request', request)

  const orError = await requestJsonRecordPromise(request, params)
  // console.debug('requestCallbackPromise response', orError)
  if (isDefiniteError(orError)) return orError

  progress?.did(1)
  const { data } = orError
  if (isRequest(data)) return requestCallbackPromise(data, progress)

  return orError
}

export const requestJsonRecordPromise = (request: EndpointRequest, params?: any): Promise<JsonRecordDataOrError> => {
  const [url, init] = requestUrlInit(request, params)
  try {
    return fetch(url, init).then(response => response.json()).then(orError => {
      if (isDefiniteError(orError)) return orError

      return orError.data ? orError : { data: orError }
    }).catch(error => errorCaught(error))
  }
  catch (error) { return errorPromise(errorCaught(error).error.message) }
}


//   return fetchUrlPromise(request).then(orError => {
//     if (isDefiniteError(orError)) return orError

//     const { data: url } = orError
//     const { [url]: imagePromise } = IMAGE_PROMISES
//     if (imagePromise) return imagePromise

//     return IMAGE_PROMISES[url] = new Promise<ClientImageDataOrError>(resolve => {
//       const data = new Image()
//       data.src = url
//       data.onerror = error => {
//         delete IMAGE_PROMISES[url]
//         resolve(errorCaught(error))
//       }
//       data.onload = () => {
//         request.response = data
//         delete IMAGE_PROMISES[url]
//         resolve({ data })
//       }
//     })
//   })
// }
