import path from 'path'
import { loadImage } from 'canvas'
import { ImageLoader } from "../../packages/moviemasher.js/src/Media/Image/ImageLoader"
import { Any } from "../../packages/moviemasher.js/src/declarations"

export class ImageLoaderTest extends ImageLoader {
  protected override requestUrl(url: string): Promise<Any> {
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length): url
    return loadImage(path.resolve(__dirname, './assets', file))
  }
}
