import { endpointUrl, LoadedImage, RequestObject } from "@moviemasher/moviemasher.js"


export const imagePromise = (request: RequestObject): Promise<LoadedImage> => {
  // TODO: use init?
  const { endpoint } = request
  const url = endpointUrl(endpoint)
  const image = new Image()
  // console.trace("imagePromise", url)
  image.src = url
  return new Promise<LoadedImage>(resolve => {
    image.onload = () => { resolve(image) }
  })
}

