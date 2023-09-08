import type { Method } from '@moviemasher/lib-shared'
import type { EndpointRequest, JsonRecordDataOrError, JsonRecordsDataOrError } from '@moviemasher/runtime-shared'

import { GetMethod, assertMethod, ContentTypeHeader, JsonMimetype, endpointFromUrl, assertEndpoint, assertDefined, urlForEndpoint, PostMethod, FormDataMimetype } from '@moviemasher/lib-shared'
import { isDefiniteError, isPopulatedString, isString, isUndefined } from '@moviemasher/runtime-shared'

const requestMethod = (request: EndpointRequest): Method => {
  request.init ||= {}
  const { method = PostMethod } = request.init
  assertMethod(method)

  request.init.method = method
  return method
}

const requestContentType = (request: EndpointRequest): string => {
  request.init ||= {}
  request.init.headers ||= {}
  const { [ContentTypeHeader]: contentType = JsonMimetype } = request.init.headers
  request.init.headers[ContentTypeHeader] = contentType
  return contentType
}

const requestFormData = (values: any = {}): FormData => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (isUndefined(value)) return
    console.log('requestFormData', key, value)

    if (value instanceof Blob || value instanceof File) formData.set(key, value)
    else formData.set(key, String(value))
  })
  return formData
}

const requestSearch = (values: any = {}): string => {
  return `?${new URLSearchParams(values)}`
}

export const requestPopulate = (request: EndpointRequest, params?: any): EndpointRequest => {
  if (!params) return request

  const copy = { ...request }
  if (requestMethod(copy) === GetMethod) {
    const { endpoint } = copy
    if (isPopulatedString(endpoint)) copy.endpoint = endpointFromUrl(endpoint)
    else copy.endpoint ||= {}
    const { endpoint: copyEndpoint } = copy
    assertEndpoint(copyEndpoint)

    copyEndpoint.search = requestSearch(params)
  } else {
    copy.init ||= {}
    const contentType = requestContentType(copy)
    if (contentType === JsonMimetype) {
      copy.init.body = JSON.stringify(params)
    } else {
      const { headers } = copy.init
      if (headers && FormDataMimetype === headers[ContentTypeHeader]) {
        delete headers[ContentTypeHeader]
      }
      copy.init.body = requestFormData(params)
    }
  }
  return copy
}

export const requestJsonRecordPromise = (request: EndpointRequest): Promise<JsonRecordDataOrError> => {
  const { init = {}, endpoint } = request
  assertDefined(endpoint)

  const url = isString(endpoint) ? endpoint : urlForEndpoint(endpoint)
  return fetch(url, init).then(response => {
    
    return response.json()
  }).then(orError => {
    if (isDefiniteError(orError)) return orError

    return orError.data ? orError : { data: orError }
  })
}

export const requestJsonRecordsPromise = (request: EndpointRequest): Promise<JsonRecordsDataOrError> => {
  const { init = {}, endpoint } = request
  assertDefined(endpoint)

  const url = isString(endpoint) ? endpoint : urlForEndpoint(endpoint)
  return fetch(url, init).then(response => response.json()).then(orError => {
    if (isDefiniteError(orError)) return orError

    return orError.data ? orError : { data: orError }
  })
}
