import { ApiCallback } from "../Api/Api"
import { urlForEndpoint } from "../Utility/Url"

const fetchCallback = (apiCallback: ApiCallback): Promise<any> => {
  const { endpoint, request } = apiCallback
  const init = request || {}

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
        if (typeof value === 'undefined') return

        formData.set(key, value instanceof Blob ? value : String(value))
      })

      init.body = formData
      delete init.headers[typeKey]
      break
    }
  }

  const url: string = urlForEndpoint(endpoint)
  return fetch(url, init).then(response => response.json())
}


export { fetchCallback }
