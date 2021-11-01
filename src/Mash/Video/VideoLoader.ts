import { LoadVideoPromise, DrawingSource } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Loader } from "../../Loading/Loader"

class VideoLoader extends Loader {
  type = LoadType.Video

  requestUrl(url : string) : LoadVideoPromise {
    const promise = new Promise<DrawingSource>((resolve, reject) => {
      const video = document.createElement('video')
      // document.body.appendChild(video)
      video.crossOrigin = "Anonymous"
      video.src = url
      video.autoplay = true
      video.oncanplay = (...args) => {
        console.log("oncanplay!", ...args)
        resolve(video)
      }
      // video.onerror = error => {
      //   console.error(this.constructor.name, "requestUrl onerror", error)
      //   reject(`Failed to load ${url}`)
      // }
    })
    return promise
  }
}

export { VideoLoader }
