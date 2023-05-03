import type {
  EndpointRequest, 
} from '@moviemasher/lib-core'
import { 
  isUndefined, urlForEndpoint, JsonMimetype, assertEndpoint, FormDataMimetype, ContentTypeHeader 
} from '@moviemasher/lib-core'

export interface ResponseObject {
  json(): Promise<any>
}

export const jsonPromise = (request: EndpointRequest): Promise<any> => {
  return fetchPromise(request).then(response => {
    return response.json()
  })
}



export const fetchPromise = (request: EndpointRequest): Promise<ResponseObject> => {
  const { endpoint, init = {} } = request
  assertEndpoint(endpoint)


  init.method ||= 'POST'
  init.headers ||= {}
  init.headers[ContentTypeHeader] ||= JsonMimetype
  if (init.method === 'POST') {
    switch (init.headers[ContentTypeHeader]) {
      case JsonMimetype: {
        init.body = JSON.stringify(init.body)
        break
      }
      case FormDataMimetype: {
        const formData = new FormData()
        Object.entries(init.body).forEach(([key, value]) => {
          if (isUndefined(value)) return

          formData.set(key, value instanceof Blob ? value : String(value))
        })

        init.body = formData
        delete init.headers[ContentTypeHeader]
        break
      }
    }
  }
  const url: string = urlForEndpoint(endpoint)
  return fetch(url, init)
}
