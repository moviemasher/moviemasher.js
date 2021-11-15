import { ImageLoader } from "../../src/Mash/Image/ImageLoader"
import { Any } from "../../src/declarations";
import path from 'path';
import { loadImage } from 'canvas';

export class ImageLoaderTest extends ImageLoader {
  requestUrl(url: string): Promise<Any> {
    const { baseURI } = document
    const file = url.startsWith(baseURI) ? url.slice(baseURI.length): url
    return loadImage(path.resolve(__dirname, '..', file))
  }
}
