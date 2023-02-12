import { RequestObject, isUndefined, urlForEndpoint } from "@moviemasher/moviemasher.js"

export interface ResponseObject {
  json(): Promise<any>

}
export const jsonPromise = (request: RequestObject): Promise<any> => {
  return fetchPromise(request).then(response => response.json())
}

export const fetchPromise = (request: RequestObject): Promise<ResponseObject> => {
  const { endpoint, init = {} } = request
  
  // console.log('jsonPromise', endpoint, init)

  const typeKey = 'Content-Type'
  const jsonType = 'application/json'

  const formType = 'multipart/form-data'

  init.method ||= 'POST'
  init.headers ||= {}
  init.headers[typeKey] ||= jsonType
  switch (init.headers[typeKey]) {
    case jsonType: {
      init.body = JSON.stringify(init.body)
      break
    }
    case formType: {
      const formData = new FormData()
      Object.entries(init.body).forEach(([key, value]) => {
        if (isUndefined(value)) return

        formData.set(key, value instanceof Blob ? value : String(value))
      })

      init.body = formData
      delete init.headers[typeKey]
      break
    }
  }

  const url: string = urlForEndpoint(endpoint)
  return fetch(url, init)
}
