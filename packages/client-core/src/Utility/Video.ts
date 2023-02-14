import { 
  endpointUrl, ErrorName, ClientVideoOrError, Request, errorThrow,
} from "@moviemasher/moviemasher.js"


const videoFromUrl = (url: string): HTMLVideoElement => {
  const { document } = globalThis
  if (!document) errorThrow(ErrorName.Environment) 

  const video = document.createElement('video')
  // video.crossOrigin = 'anonymous'
  video.src = url
  return video
}

export const clientVideoPromise =  (request: Request): Promise<ClientVideoOrError> => {
  // TODO: use init?
  const { endpoint } = request
  const url = endpointUrl(endpoint)
  
  return new Promise<ClientVideoOrError>((resolve, reject) => {
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
      resolve({ clientVideo, clientMedia: clientVideo })
    }
    clientVideo.onerror = reject
    clientVideo.autoplay = false
    // video.requestVideoFrameCallback(() => {})
    clientVideo.load()
  })
}
