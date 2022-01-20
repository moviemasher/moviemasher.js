import { LoadImagePromise } from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Loader } from "../../Loader/Loader"

class ImageLoader extends Loader {
  type = LoadType.Image

  protected override requestUrl(url : string) : LoadImagePromise {
    const image = new Image()
    image.crossOrigin = "Anonymous"
    image.src = url
    return image.decode().then(() => Promise.resolve(image))
  }
}

export { ImageLoader }
