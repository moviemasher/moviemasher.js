import { 
  endpointUrl, ErrorName, Request, errorThrow, ClientVideoDataOrError, errorCaught, assertEndpoint,
} from "@moviemasher/moviemasher.js"


const videoFromUrl = (url: string): HTMLVideoElement => {
  const { document } = globalThis
  if (!document) errorThrow(ErrorName.Environment) 

  const video = document.createElement('video')
  // video.crossOrigin = 'anonymous'
  video.src = url
  return video
}

export const videoDataPromise = (request: Request): Promise<ClientVideoDataOrError> => {
  const { endpoint } = request
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  
  return new Promise<ClientVideoDataOrError>((resolve) => {
    const clientVideo = videoFromUrl(url)
    clientVideo.oncanplay = () => {
      clientVideo.oncanplay = null
      clientVideo.onerror = null

      const { videoWidth, clientWidth, videoHeight, clientHeight } = clientVideo
      const width = videoWidth || clientWidth
      const height = videoHeight || clientHeight
      clientVideo.width = width
      clientVideo.height = height

      // console.log(this.constructor.name, "videoPromise.oncanplay", width, height)
      resolve({ data: clientVideo })
    }
    clientVideo.onerror = error => { resolve(errorCaught(error)) }
    clientVideo.autoplay = false
    // video.requestVideoFrameCallback(() => {})
    clientVideo.load()
  })
}
