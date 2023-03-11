import { 
  endpointUrl, Request, ClientImageDataOrError, ErrorName, error, 
  assertEndpoint 
} from "@moviemasher/moviemasher.js"

export const imageDataPromise = (request: Request): Promise<ClientImageDataOrError> => {
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
