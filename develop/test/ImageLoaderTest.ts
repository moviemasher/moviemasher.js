import { ImageLoader } from "../../src/Mash/Image/ImageLoader"
import { Any } from "../../src/declarations";
import path from 'path';
import { loadImage } from 'canvas';

export class ImageLoaderTest extends ImageLoader {
  requestUrl(url : string) : Promise<Any> {
    return loadImage(path.resolve(__dirname, '..', url))

    // return new Promise((resolve, reject) => {
    //   loadImage(path.resolve(__dirname, url))
    //     .then(image => resolve(image))
    //     .catch(error => reject(error))
    // });
  }
}
