import { LoadedVideo, LoadVideoPromise } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Loader } from "../../Loader/Loader"

class VideoLoader extends Loader {
  protected override requestUrl(url: string): LoadVideoPromise {
    const promise: LoadVideoPromise = new Promise((resolve, reject) => {
      return this.videoPromiseFromUrl(url).then(video => {
        return this.arrayBufferPromiseFromUrl(url).then(arrayBuffer => {
          return this.audioBufferPromiseFromArrayBuffer(arrayBuffer).then(audioBuffer => {
            resolve({ video, audio: audioBuffer, sequence: [] })
          })
        })
      })
      .catch(reject)
    })
    return promise
  }

  type = LoadType.Video

  private videoPromiseFromUrl(url: string): Promise<LoadedVideo> {
    return new Promise<LoadedVideo>((resolve, reject) => {
      const video = this.videoFromUrl(url)

      video.ondurationchange = () => {
        video.ondurationchange = null
        video.width = video.videoWidth
        video.height = video.videoHeight
        // console.debug(this.constructor.name, "videoPromiseFromUrl", 'ondurationchange', video.width, video.height)
        resolve(video)
      }
      video.onerror = reject
      video.load()
    })
  }

  videoFromUrl(url: string): HTMLVideoElement {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    return video
  }
}

export { VideoLoader }
