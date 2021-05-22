import { LoadType } from "../Setup"
import { Loader } from "./Loader"

class ImageLoader extends Loader {
  constructor(object) {
    super(object)
    this.object.type ||= LoadType.image
  }
  
  requestUrl(url) {
    // console.log("ImageLoader.requestUrl", url)
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = event => resolve(event.target)
      image.onerror = event => reject(event)
      image.crossOrigin = "Anonymous"
      image.src = url  
      return image
    })
  }
}

export { ImageLoader }