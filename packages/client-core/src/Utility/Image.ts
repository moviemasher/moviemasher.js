import { endpointUrl, ClientImageOrError, RequestObject } from "@moviemasher/moviemasher.js"


export const clientImagePromise = (request: RequestObject): Promise<ClientImageOrError> => {
  // TODO: use init
  const { endpoint } = request
  const url = endpointUrl(endpoint)
  const clientImage = new Image()
  // console.trace("clientImagePromise", url)
  clientImage.src = url
  return new Promise<ClientImageOrError>(resolve => {
    clientImage.onload = () => { resolve({ clientImage }) }
  })
}

