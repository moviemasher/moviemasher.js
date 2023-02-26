import { 
  endpointUrl, Request, ImageData, ImageDataOrError, ErrorName, error, 
  assertEndpoint 
} from "@moviemasher/moviemasher.js"

export const imageDataPromise = (request: Request): Promise<ImageDataOrError> => {
  const { endpoint } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  const data = new Image()
  data.src = url
  return new Promise<ImageDataOrError>(resolve => {
    data.onerror = () => {
      resolve(error(ErrorName.Url))
    }
    data.onload = () => { 
      const imageData: ImageData = { data }
      resolve(imageData) 
    }
  })
}
