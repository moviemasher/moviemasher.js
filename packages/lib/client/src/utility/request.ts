import type { Method, JsonRecordDataOrError, JsonRecordsDataOrError } from '@moviemasher/lib-shared'
import type { EndpointRequest } from '@moviemasher/runtime-shared'

import { GetMethod, assertMethod, ContentTypeHeader, JsonMimetype, endpointFromUrl, assertEndpoint, assertDefined, urlForEndpoint } from '@moviemasher/lib-shared'
import { isPopulatedString, isString, isUndefined } from '@moviemasher/runtime-shared'

const requestMethod = (request: EndpointRequest): Method => {
  const { init = {} } = request
  const { method = GetMethod } = init
  assertMethod(method)

  return method
}
const requestContentType = (request: EndpointRequest): string => {
  const { init = {} } = request
  const { headers = {} } = init
  const { [ContentTypeHeader]: contentType = JsonMimetype } = headers
  return contentType
}
const requestFormData = (values: any = {}): FormData => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (isUndefined(value)) return

    const isBlobOrFile = value instanceof Blob || value instanceof File
    const blobFileOrString = isBlobOrFile ? value : String(value)
    formData.set(key, blobFileOrString)
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
      copy.init.body = requestFormData(params)
    }
  }
  return copy
}

export const requestJsonRecordPromise = (request: EndpointRequest): Promise<JsonRecordDataOrError> => {
  const { init = {}, endpoint } = request
  assertDefined(endpoint)

  const url = isString(endpoint) ? endpoint : urlForEndpoint(endpoint)
  return fetch(url, init).then(response => response.json()).then(data => ({ data }))
}

export const requestJsonRecordsPromise = (request: EndpointRequest): Promise<JsonRecordsDataOrError> => {
  const { init = {}, endpoint } = request
  assertDefined(endpoint)

  const url = isString(endpoint) ? endpoint : urlForEndpoint(endpoint)
  return fetch(url, init).then(response => response.json()).then(data => {
    // console.log('requestJsonRecordsPromise', url, data)
    return { data }
  })
}