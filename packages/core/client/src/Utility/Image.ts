import type {
  EndpointRequest, ClientImageDataOrError, 
} from '@moviemasher/lib-core'
import { 
  endpointUrl, ErrorName, error, 
  assertEndpoint 
} from '@moviemasher/lib-core'

export const imageDataPromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
  const { endpoint } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  const data = new Image()
  data.src = url
  return new Promise<ClientImageDataOrError>(resolve => {
    data.onerror = () => {
      resolve(error(ErrorName.Url))
    }
    data.onload = () => { 
      resolve({ data }) 
    }
  })
}
