import { LoadImagePromise } from "../Setup/declarations"
import { LoadType } from "../Setup/Enums"
import { Loader } from "./Loader"

class ImageLoader extends Loader {
  type = LoadType.Image

  requestUrl(url : string) : LoadImagePromise {
    const image = new Image()
    image.crossOrigin = "Anonymous"
    image.src = url
    return image.decode().then(() => Promise.resolve(image))
  }
}

export { ImageLoader }
