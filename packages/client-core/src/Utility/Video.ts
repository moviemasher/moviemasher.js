import { endpointUrl, Errors, LoadedVideo, RequestInitObject, RequestObject } from "@moviemasher/moviemasher.js"

const videoFromUrl = (url: string): HTMLVideoElement => {
  const { document } = globalThis
  if (!document) throw new Error(Errors.invalid.environment)

  const video = document.createElement('video')
  // video.crossOrigin = 'anonymous'
  video.src = url
  return video
}

export const videoPromise =  (request: RequestObject): Promise<LoadedVideo> => {
  // TODO: use init?
  const { endpoint } = request
  const url = endpointUrl(endpoint)
  
  return new Promise<LoadedVideo>((resolve, reject) => {
    const video = videoFromUrl(url)
    video.oncanplay = () => {
      video.oncanplay = null
      video.onerror = null

      const { videoWidth, clientWidth, videoHeight, clientHeight } = video
      const width = videoWidth || clientWidth
      const height = videoHeight || clientHeight
      video.width = width
      video.height = height

      // console.log(this.constructor.name, "videoPromise.oncanplay", width, height)
      resolve(video)
    }
    video.onerror = reject
    video.autoplay = false
    // video.requestVideoFrameCallback(() => {})
    video.load()
  })
}
